export type ColorScheme = 'light' | 'dark';
export type ColorSchemeChangeEvent = CustomEvent<{ colorScheme: ColorScheme }>;
export type PermanentColorSchemeEvent = CustomEvent<{ colorScheme: ColorScheme, permanent: boolean }>;

export class DarkMode extends HTMLElement {
  mode?: ColorScheme;
  /**
   * Defaults to not remember the last choice.
   * If present remembers the last selected mode (`dark` or `light`),
   * which allows the user to permanently override their usual preferred color scheme.
   */
  permanent?: boolean;
  /**
   * Any string value that represents the label for the "dark" mode.
   */
  dark?: string;
  /**
   * Any string value that represents the label for the "light" mode.
   */
  light?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'dark-mode': DarkMode;
  }
  interface GlobalEventHandlersEventMap {
    /**
     * Fired when the color scheme gets changed.
     * 
     * ```js
     * const toggle = document.querySelector('dark-mode');
     * document.addEventListener('colorschemechange', (e) => {
     *   console.log(`Color scheme changed to "${e.detail.colorScheme}".`);
     *   console.log(toggle.mode === 'dark' ? 'Change Theme 🌞' : 'Change Theme 🌒')
     * });
     * ```
     */
    'colorschemechange': ColorSchemeChangeEvent;
    /**
     * Fired when the color scheme should be permanently remembered or not.
     * 
     * ```js
     * document.addEventListener('permanentcolorscheme', (e) => {
     *   console.log(`~: Color scheme changed to "${e.detail.colorScheme}" , "${e.detail.permanent}" .`);
     * });
     * ```
     */
    'permanentcolorscheme': PermanentColorSchemeEvent;
  }
  namespace JSX {
    interface IntrinsicElements {
      'dark-mode': Partial<DarkMode> | {
        style?: Partial<CSSStyleDeclaration> | React.CSSProperties;
      };
    }
  }
}
