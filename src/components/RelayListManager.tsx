import { useEffect, useState } from 'react';
import { Plus, Settings, Wifi, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/hooks/useAppContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/useToast';

interface Relay {
  url: string;
  read: boolean;
  write: boolean;
}

export function RelayListManager() {
  const { config, updateConfig } = useAppContext();
  const { user } = useCurrentUser();
  const { mutate: publishEvent } = useNostrPublish();
  const { toast } = useToast();
  const [relays, setRelays] = useState<Relay[]>(config.relayMetadata.relays);
  const [newRelayUrl, setNewRelayUrl] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRelays(config.relayMetadata.relays);
  }, [config.relayMetadata.relays]);

  const normalizeRelayUrl = (url: string): string => {
    const trimmed = url.trim();
    try {
      return new URL(trimmed).toString();
    } catch {
      try {
        return new URL(`wss://${trimmed}`).toString();
      } catch {
        return trimmed;
      }
    }
  };

  const isValidRelayUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      new URL(normalizeRelayUrl(url));
      return true;
    } catch {
      return false;
    }
  };

  const saveRelays = (nextRelays: Relay[]) => {
    // eslint-disable-next-line react-hooks/purity
    const now = Math.floor(Date.now() / 1000);

    updateConfig((current) => ({
      ...current,
      relayMetadata: {
        relays: nextRelays,
        updatedAt: now,
      },
    }));

    if (user) {
      publishRelayList(nextRelays);
    }
  };

  const publishRelayList = (relayList: Relay[]) => {
    const tags = relayList
      .map((relay) => {
        if (relay.read && relay.write) return ['r', relay.url];
        if (relay.read) return ['r', relay.url, 'read'];
        if (relay.write) return ['r', relay.url, 'write'];
        return undefined;
      })
      .filter((tag): tag is string[] => Boolean(tag));

    publishEvent(
      {
        kind: 10002,
        content: '',
        tags,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Relays saved',
            description: 'Your relay list was published to your Nostr account.',
          });
        },
        onError: () => {
          toast({
            title: 'Relays saved locally',
            description: 'Publishing your relay list did not work this time.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  const addRelay = () => {
    if (!isValidRelayUrl(newRelayUrl)) {
      toast({
        title: 'Invalid relay URL',
        description: 'Try a relay like wss://relay.damus.io.',
        variant: 'destructive',
      });
      return;
    }

    const normalized = normalizeRelayUrl(newRelayUrl);
    if (relays.some((relay) => relay.url === normalized)) {
      toast({
        title: 'Already connected',
        description: 'That relay is already in your list.',
        variant: 'destructive',
      });
      return;
    }

    const nextRelays = [...relays, { url: normalized, read: true, write: true }];
    setRelays(nextRelays);
    setNewRelayUrl('');
    saveRelays(nextRelays);
  };

  const removeRelay = (url: string) => {
    const nextRelays = relays.filter((relay) => relay.url !== url);
    setRelays(nextRelays);
    saveRelays(nextRelays);
  };

  const toggleRelay = (url: string, key: 'read' | 'write') => {
    const nextRelays = relays.map((relay) => (
      relay.url === url ? { ...relay, [key]: !relay[key] } : relay
    ));
    setRelays(nextRelays);
    saveRelays(nextRelays);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        {relays.map((relay) => (
          <div
            key={relay.url}
            className="flex items-center gap-3 border-2 border-[#241232] bg-[#fffdf7] p-3 shadow-[4px_4px_0_#a855f7] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[4px_4px_0_#6d28d9]"
          >
            <Wifi className="size-4 shrink-0 text-[#6d28d9] dark:text-[#e879f9]" />
            <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold text-[#241232] dark:text-[#fffdf7]" title={relay.url}>
              {renderRelayUrl(relay.url)}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 shrink-0 text-[#5f4a6f] hover:text-[#6d28d9] dark:text-[#d8c4ea] dark:hover:text-[#e879f9]">
                  <Settings className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`read-${relay.url}`}>Read</Label>
                    <Switch id={`read-${relay.url}`} checked={relay.read} onCheckedChange={() => toggleRelay(relay.url, 'read')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`write-${relay.url}`}>Write</Label>
                    <Switch id={`write-${relay.url}`} checked={relay.write} onCheckedChange={() => toggleRelay(relay.url, 'write')} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeRelay(relay.url)}
              className="size-9 shrink-0 text-[#5f4a6f] hover:text-destructive dark:text-[#d8c4ea]"
              disabled={relays.length <= 1}
              aria-label={`Remove ${relay.url}`}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="new-relay-url" className="sr-only">
            Relay URL
          </Label>
          <Input
            id="new-relay-url"
            placeholder="wss://relay.example.com"
            value={newRelayUrl}
            onChange={(event) => setNewRelayUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addRelay();
            }}
            className="h-11 rounded-[4px] border-2 border-[#241232] bg-[#fffdf7] text-[#241232] dark:border-[#a855f7] dark:bg-[#151019] dark:text-[#fffdf7]"
          />
        </div>
        <Button
          type="button"
          onClick={addRelay}
          disabled={!newRelayUrl.trim()}
          className="h-11 rounded-[4px] border-2 border-[#241232] !bg-[#6d28d9] font-bold !text-white shadow-[4px_4px_0_#241232] hover:!bg-[#5b21b6] dark:!border-[#e879f9]"
        >
          <Plus className="mr-2 size-4" />
          Add relay
        </Button>
      </div>

      {!user ? (
        <p className="text-sm leading-6 text-[#5f4a6f] dark:text-[#d8c4ea]">
          Log in to publish relay changes to your Nostr account. Until then, changes stay on this device.
        </p>
      ) : null}
    </div>
  );
}

function renderRelayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'wss:' && parsed.pathname === '/'
      ? parsed.host
      : parsed.href.replace(/^wss:\/\//, '');
  } catch {
    return url;
  }
}
