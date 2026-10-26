/**
 * Imperative navigation for code that lives outside React (Redux thunks).
 * <NavigationBridge /> (mounted once in the root providers) registers the Next.js router here.
 */

type RouterLike = {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
};

let router: RouterLike | null = null;

export const registerRouter = (next: RouterLike | null) => {
  router = next;
};

const navigation = {
  push: (href: string) => {
    if (router) router.push(href);
    else if (typeof window !== 'undefined') window.location.assign(href);
  },
  replace: (href: string) => {
    if (router) router.replace(href);
    else if (typeof window !== 'undefined') window.location.replace(href);
  },
  back: () => {
    if (router) router.back();
    else if (typeof window !== 'undefined') window.history.back();
  }
};

export default navigation;
