import { toast } from 'sonner';

type NotifyOptions = {
  /** Secondary line shown under the title. */
  message?: string;
  /** Auto dismiss delay in ms. */
  duration?: number;
};

const build = ({ message, duration }: NotifyOptions = {}) => ({
  description: message || undefined,
  duration
});

// Thin wrapper over sonner so store thunks and components notify the user the same way.
const notify = {
  success: (title: string, options?: NotifyOptions) =>
    toast.success(title, build(options)),
  error: (title: string, options?: NotifyOptions) =>
    toast.error(title, build(options)),
  warning: (title: string, options?: NotifyOptions) =>
    toast.warning(title, build(options)),
  info: (title: string, options?: NotifyOptions) =>
    toast.info(title, build(options))
};

export default notify;
