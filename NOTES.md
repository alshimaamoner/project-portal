# Implementation notes

## 1. Applying HOCs at module level
I create wrapped components outside other components so React sees the same component on every render. 
Creating a HOC inside a component makes a new component each time it renders. This can reset input values and local state restart effects.

## 2. Keeping the loading prop outside the page
The generic type `P` keeps the wrapped component's own props checked by TypeScript. 
The wrapper adds an `isLoading` prop and removes it before passing the other props to the page.
 The `as P` assertion tells TypeScript that the remaining props belong to the wrapped component. The page never receives `isLoading`.

## 3. Returning after login
When someone opens a protected page while signed out, `withAuth` saves the requested URL in `state.from` and redirects to `/login`.
 After a successful login, the app saves the user in localStorage and updates the auth context.

The login page then returns the user to the saved URL, including its filters. If there is no valid saved URL, it opens `/dashboard`.
 A signed-in user who opens `/login` directly also goes to `/dashboard`. These redirects use `replace` so the login page does not remain as an extra history entry.

## 4. With more time
I would add automated browser tests for refresh, keyboard navigation, and the Back button. The current tests check the main routing and data behavior, 
but browser tests would also check real browser history and persistence after a reload.
