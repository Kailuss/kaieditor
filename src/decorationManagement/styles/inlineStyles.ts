import { BaseStyleConfig } from './baseStyles';

/**
 * Style configuration specifically for inline comment decorations
 * Inline comments are single-line comments or comments after code
 */
export type InlineStyleConfig = BaseStyleConfig & {
    fontSize          : string; // e.g. '0.75em'
    paddingTop        : string; // e.g. '1.75px'
    paddingBottom     : string; // e.g. '2px'
    paddingHorizontal : number; // e.g. 10
    borderRadius      : number; // e.g. 16
    iconMargin        : string; // Calculated dynamically, e.g. '0.14em -30px 0 0'
};
