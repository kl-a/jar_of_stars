// Type definitions — mirrors TypeScript interfaces from the design document.
// When migrating to Next.js + TypeScript, replace these JSDoc blocks with
// actual TS interface / type declarations in this same file.

/**
 * @typedef {Object} Star
 * @property {string}   star_id
 * @property {string}   message
 * @property {string[]} from_people_ids
 * @property {string}   date             ISO date string e.g. "2024-03-15"
 * @property {string[]} tags
 * @property {boolean}  favourite
 * @property {number}   pull_count
 * @property {string}   created_at       ISO timestamp
 * @property {string}   updated_at       ISO timestamp
 */

/**
 * @typedef {Object} Person
 * @property {string}   people_id
 * @property {string}   name
 * @property {string}   note
 * @property {string}   avatar_id        e.g. "avatar_01"
 * @property {string[]} star_ids
 * @property {boolean}  is_new
 * @property {string}   created_at       ISO timestamp
 */

/**
 * @typedef {Object} JarOfStarsDatabase
 * @property {string}   version          Schema version e.g. "1.0.0"
 * @property {string}   exportedAt       ISO timestamp
 * @property {Star[]}   stars
 * @property {Person[]} people
 */
