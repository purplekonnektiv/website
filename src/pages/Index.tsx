import { useSeoMeta } from '@unhead/react';

import { PurpleKonnektivHome } from '@/components/PurpleKonnektivHome';

const Index = () => {
  useSeoMeta({
    title: 'PurpleKonnektiv - Nostr-native collective signal',
    description: 'PurpleKonnektiv surfaces Nostr posts and NIP-52 events tagged #purplekonnektiv for a collective around decentralized social media.',
    ogTitle: 'PurpleKonnektiv',
    ogDescription: 'A Nostr-native website for posts, images, and events tagged #purplekonnektiv.',
    ogType: 'website',
  });

  return <PurpleKonnektivHome />;
};

export default Index;
