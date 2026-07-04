/**
 * DEPRECATED alias — dead duplicate kept only so the legacy
 * `@/services/widgetRegistry` import path keeps resolving.
 *
 * The single source of truth is the feature-local registry, which is fully
 * de-rainbowed to the warm "Old Money" palette (brass / cognac / burgundy /
 * forest). Do NOT add metadata here — edit the canonical file below, and
 * ideally delete this shim once nothing references this path.
 *
 * See apps/frontend/DESIGN-SYSTEM.md
 */
export * from '@/lumen-os/dashboard/services/widgetRegistry'
