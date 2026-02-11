import { BaseStyleConfig } from './baseStyles';

/**
 * Style configuration specifically for block comment decorations
 * Block comments are multi-line comments and documentation comments
 */
export type BlockStyleConfig = BaseStyleConfig & {
    fontSize          : string; // e.g. '0.75em'
    paddingVertical   : number; // e.g. 4
    paddingHorizontal : number; // e.g. 10
    borderRadius      : number; // e.g. 16
    borderWidth       : string; // e.g. '1px'
    borderStyle       : string; // e.g. 'solid'
    iconMargin        : string; // Calculated dynamically, e.g. '0.14em -16px 0 0'
};
