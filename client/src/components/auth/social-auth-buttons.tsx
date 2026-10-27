import { Button } from '@/components/ui/button';
import { FacebookIcon, GoogleIcon } from '@/components/shared/brand-icons';
import { API_URL } from '@/lib/constants';

type SocialAuthButtonsProps = {
  /** Only changes the button wording; both providers use the same API endpoints. */
  mode?: 'login' | 'register';
};

/** "Login with Google / Facebook": plain links to the API's OAuth endpoints. */
export function SocialAuthButtons({ mode = 'login' }: SocialAuthButtonsProps) {
  const verb = mode === 'login' ? 'Login' : 'Sign up';

  return (
    <div className='grid gap-3'>
      <Button asChild variant='outline' size='lg'>
        <a href={`${API_URL}/auth/google`}>
          <GoogleIcon className='size-5' />
          {verb} with Google
        </a>
      </Button>
      <Button asChild variant='outline' size='lg'>
        <a href={`${API_URL}/auth/facebook`}>
          <FacebookIcon className='size-5' />
          {verb} with Facebook
        </a>
      </Button>
    </div>
  );
}
