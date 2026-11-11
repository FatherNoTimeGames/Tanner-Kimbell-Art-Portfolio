# Portfolio maintenance

## Current implementation

Stage 2: buildless HTML, CSS, and JavaScript in `docs/`. The collection is empty because no portfolio artwork has been explicitly approved. Artwork views support title, category, description, caption, alt text, a thumbnail, and a full image. Category filters appear when there are multiple categories.

The Art Challenges page and a static Week 1 assignment view are established. The Drowned Stag remains Active. Reference selection/verification and structured challenge progress tracking belong to later stages. No completion, critique acknowledgment, or challenge start date has been assumed. No future assignment content exists.

## Adding an approved painting

1. Obtain explicit approval for portfolio inclusion and public image publication.
2. Keep the supplied original unchanged. Only commit an original to this public repository if its publication is approved and its size is practical.
3. Produce optimized web images and thumbnails from the actual supplied artwork; do not synthesize, repaint, or substitute artwork. Put public derivatives under `docs/assets/artwork/`.
4. Add one entry to `docs/data/works.json` with these fields:
   - `id`: unique lowercase, hyphen-separated identifier.
   - `title`, `category`, `alt`: nonempty text; alt describes the painting.
   - `image`, `thumbnail`: paths beginning `assets/artwork/` relative to `docs/`.
   - `portfolioApproved`: `true`, only after explicit approval.
   - `description`, `caption`: optional text.
5. Link to `artwork/?id=<id>`. Check the gallery, filter buttons, full artwork view, image loading, and back links at mobile and desktop widths.

Never include unapproved records in public JSON, even with a false approval flag. Runtime validation is a guard against errors, not a privacy boundary. Challenge completion never implies portfolio approval.

## Development and review

There are no runtime dependencies or build steps. Use any static HTTP server with `docs/` as the document root. Also verify from a project subpath, since GitHub Pages project sites are not hosted at the domain root. All navigation, assets, and catalog fetches use relative paths.

Use a development branch and focused commits. Preserve unrelated work and recheck the branch head before writing. Review changes before merging. Deployment and settings changes require separate approval. Do not add an automatic deployment workflow at this stage.

## Proposed Pages setup (not enabled)

After deployment approval, configure GitHub Pages to publish from `main` / `docs`. `docs/.nojekyll` requests direct static file publishing. Never publish the repository root. The default project address would be `https://fathernotimegames.github.io/Tanner-Kimbell-Art-Portfolio/`; no live site has been verified.

Only approved public website files belong under `docs/`. Keep notes, originals, and development records outside it. Everything committed anywhere in this repository is publicly accessible through GitHub. Notes and unpublished artwork must stay out of this public repository. A separate private notes repository may be proposed later; do not create one without approval.

## Verification status

With an empty approved catalog, real artwork image loading cannot yet be checked. Repeat image, thumbnail, and nonempty-gallery visual checks when the first approved painting is added. The initial gallery must remain empty until then.
