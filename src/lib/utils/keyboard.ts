/**
 * Keyboard utilities for handling keyboard events and shortcuts
 */

import type { Action } from 'svelte/action';
import { browser } from '$app/environment';

/**
 * Keyboard shortcut handler config
 */
export interface KeyboardShortcut {
  key: string;             // Key to listen for (e.g., 'Enter', 'Escape', 'ArrowDown')
  ctrl?: boolean;          // Whether Ctrl key must be pressed
  meta?: boolean;          // Whether Meta (Command) key must be pressed
  alt?: boolean;           // Whether Alt key must be pressed
  shift?: boolean;         // Whether Shift key must be pressed
  preventDefault?: boolean; // Whether to prevent default browser behavior
  stopPropagation?: boolean; // Whether to stop event propagation
  callback: (event: KeyboardEvent) => void; // Function to execute when shortcut is triggered
}

/**
 * Check if a keyboard event matches a shortcut definition
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  // Check if key matches
  if (event.key !== shortcut.key) return false;
  
  // Check modifier keys
  if (shortcut.ctrl && !event.ctrlKey) return false;
  if (shortcut.meta && !event.metaKey) return false;
  if (shortcut.alt && !event.altKey) return false;
  if (shortcut.shift && !event.shiftKey) return false;
  
  return true;
}

/**
 * Handle keyboard event against a list of shortcuts
 */
export function handleKeyboardShortcuts(event: KeyboardEvent, shortcuts: KeyboardShortcut[]): void {
  for (const shortcut of shortcuts) {
    if (matchesShortcut(event, shortcut)) {
      // Prevent default browser behavior if configured
      if (shortcut.preventDefault) {
        event.preventDefault();
      }
      
      // Stop event propagation if configured
      if (shortcut.stopPropagation) {
        event.stopPropagation();
      }
      
      // Execute the callback
      shortcut.callback(event);
      
      // Stop checking other shortcuts after a match
      break;
    }
  }
}

/**
 * Register global keyboard shortcuts
 * @param shortcuts Array of keyboard shortcuts to register
 * @returns Cleanup function to remove listeners
 */
export function registerGlobalShortcuts(shortcuts: KeyboardShortcut[]): () => void {
  if (!browser) return () => {};
  
  const handleKeyDown = (event: KeyboardEvent) => {
    handleKeyboardShortcuts(event, shortcuts);
  };
  
  // Add the event listener
  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Svelte action for handling keyboard shortcuts on an element
 */
export const keyboardShortcuts: Action<HTMLElement, KeyboardShortcut[]> = (node, shortcuts) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    handleKeyboardShortcuts(event, shortcuts);
  };
  
  node.addEventListener('keydown', handleKeyDown);
  
  return {
    update(newShortcuts) {
      shortcuts = newShortcuts;
    },
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
    }
  };
};

/**
 * Common keyboard navigation for dropdown/suggestion lists
 * @param activeIndex Current active index
 * @param items Array of items being navigated
 * @param onSelect Function to call when an item is selected
 * @param onClose Function to call when navigation should be closed
 * @returns Keyboard event handler
 */
export function createListNavigationHandler(
  activeIndex: number, 
  items: any[], 
  onSelect: (item: any) => void,
  onClose?: () => void
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (items.length > 0) {
          activeIndex = (activeIndex + 1) % items.length;
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (items.length > 0) {
          activeIndex = (activeIndex - 1 + items.length) % items.length;
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < items.length) {
          onSelect(items[activeIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (onClose) {
          onClose();
        }
        break;
    }
  };
}

/**
 * Helper function to execute search on Ctrl+Enter or Cmd+Enter
 * @param callback Function to execute when shortcut is triggered
 */
export function setupSearchExecuteShortcut(callback: () => void): () => void {
  return registerGlobalShortcuts([
    {
      key: 'Enter',
      ctrl: true,
      callback
    },
    {
      key: 'Enter',
      meta: true,
      callback
    }
  ]);
}

