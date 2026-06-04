# Monsieur App Scope

Monsieur by Aelier Groupe is a luxury menswear digital experience for private clients. The build should combine refined editorial presentation with functional commerce, wardrobe curation, made-to-measure commissioning, provenance, and client-service workflows.

## Product Goal

Create a premium web and mobile app experience that lets a private client:

- Discover collections and materials.
- View garments through rich product imagery and specification boards.
- Save pieces to a personal wardrobe.
- Commission made-to-measure garments.
- Review fibre provenance and craftsmanship details.
- Complete checkout and order workflows.
- Manage their private-client dossier, fittings, requests, and activity.

## Experience Principles

The app should feel:

- Elegant, warm, and understated.
- Editorial but usable.
- Personal rather than generic.
- Trustworthy around provenance, craft, and service.
- Quietly luxurious, with no unnecessary visual noise.

## Design Direction

Use the existing Monsieur visual language as the source of truth:

- Warm parchment and cream surfaces.
- Refined serif typography.
- Restrained ink, bronze, and neutral tones.
- Product-board imagery, tailoring details, flatlays, and material macro shots.
- Simple, polished controls that support the client journey.

Avoid generic ecommerce styling, loud marketing layouts, decorative visual clutter, and placeholder-heavy product presentation when real garment imagery is available.

## Functional Scope

The app should support:

- Product catalogue browsing.
- Product detail pages.
- Material search and filtering.
- Wardrobe save/remove actions.
- Checkout and payment flow.
- Made-to-measure flow.
- Fitting/contact requests.
- Private-client dossier.
- Fibre passport/provenance pages.
- Mobile app equivalent flows.

## Backend Scope

The backend should support persistent data for:

- Clients and sessions.
- Products and materials.
- Wardrobe items.
- Orders and payment state.
- Made-to-measure commissions.
- Fitting requests.
- Contact/client-service requests.
- Client activity/events.

Supabase is the intended hosted database path, with local development fallback acceptable during prototyping.

## Build Standard

Every major feature should work end to end, not just appear in the UI. After changes, test the relevant user flows in the browser and confirm that backend records are created or updated correctly.

The north star: Monsieur should feel like a private atelier in software form: beautiful, calm, personal, and fully functional.
