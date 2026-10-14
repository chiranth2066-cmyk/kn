<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Load liquidGL only through a dynamic import in a browser effect; its module accesses browser globals and must never enter SSR execution.
- Render liquidGL on decorative layers with `content: false`, leaving real text, controls and accessibility in the original DOM; optics must not change application behavior.
- Own liquidGL lenses in the shared shell and destroy them on navigation, menu changes, or viewport-mode changes to prevent stale captures and leaked GPU resources.
