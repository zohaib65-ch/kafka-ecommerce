'use client';

import { Mail, MessageCircle } from 'lucide-react';

import { FacebookIcon, TwitterIcon } from '@/components/shared/brand-icons';
import { Button } from '@/components/ui/button';

type ShareButtonsProps = {
  product: { name: string; slug: string };
};

const POPUP = 'noopener,noreferrer,width=600,height=500';

// Same message the old share buttons sent, with the correct origin of the current site.
const buildShare = (product: ShareButtonsProps['product']) => {
  const url = `${window.location.origin}/product/${product.slug}`;
  const message = `I ♥ ${product.name} product on Marketlane!  Here's the link, ${url}`;
  return { url, message };
};

/** Share a product on social networks or by email (plain share links, no third party SDK). */
export function ShareButtons({ product }: ShareButtonsProps) {
  const open =
    (target: (share: ReturnType<typeof buildShare>) => string) => () => {
      window.open(target(buildShare(product)), '_blank', POPUP);
    };

  const items = [
    {
      label: 'Share on Facebook',
      icon: <FacebookIcon className='size-4' />,
      onClick: open(
        ({ url, message }) =>
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`
      )
    },
    {
      label: 'Share on Twitter',
      icon: <TwitterIcon className='size-4' />,
      onClick: open(
        ({ url, message }) =>
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
      )
    },
    {
      label: 'Share by email',
      icon: <Mail className='size-4' />,
      onClick: () => {
        const { message } = buildShare(product);
        window.location.href = `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(message)}`;
      }
    },
    {
      label: 'Share on WhatsApp',
      icon: <MessageCircle className='size-4' />,
      onClick: open(
        ({ message }) => `https://wa.me/?text=${encodeURIComponent(message)}`
      )
    }
  ];

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <span className='meta'>Share</span>
      <ul className='flex items-center gap-1'>
        {items.map(item => (
          <li key={item.label}>
            <Button
              type='button'
              variant='outline'
              size='icon'
              aria-label={item.label}
              onClick={item.onClick}
            >
              {item.icon}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
