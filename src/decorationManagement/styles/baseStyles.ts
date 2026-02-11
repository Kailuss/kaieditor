/**
 * Base style types - Visual configuration shared between inline and block decorations
 */

/**
 * Tag colors map for custom comment tags
 */
export type TagColorMap = {
    important  : string;
    completed  : string;
    warning    : string;
    info       : string;
    debug      : string;
    pending    : string;
    active     : string;
    conflict   : string;
    review     : string;
    deprecated : string;
    error      : string;
    note       : string;
    question   : string;
};

/**
 * Documentation comment colors
 */
export type DocColorConfig = {
    backgroundColor : string;
    borderColor     : string;
    textColor       : string;
};

/**
 * Base style configuration shared between inline and block decorations
 */
export type BaseStyleConfig = {
    // Core colors
    backgroundColor : string;
    textColor       : string;
    borderColor     : string;
    accentColor     : string;

    // Typography
    fontStyle   : string;
    fontWeight  : string;
    opacity     : number;

    // Special colors
    tagColors : TagColorMap;
    docColors : DocColorConfig;
};
