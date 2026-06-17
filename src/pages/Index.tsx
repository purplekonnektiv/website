import { useSeoMeta } from '@unhead/react';

import { PurpleKonnektivHome } from '@/components/PurpleKonnektivHome';

const Index = () => {
  useSeoMeta({
    title: 'PurpleKonnektiv - Community feed and calendar',
    description: 'PurpleKonnektiv gathers meetup notes, images, and events shared with #purplekonnektiv.',
    ogTitle: 'PurpleKonnektiv',
    ogDescription: 'A social home for PurpleKonnektiv meetups, recaps, images, and events.',
    ogType: 'website',
  });

  return <PurpleKonnektivHome />;
};

export default Index;
