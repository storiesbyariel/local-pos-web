// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mountPOS } from '../src/app.js';
import { createMemoryStorage } from '../src/storage.js';

describe('browser smoke flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders and supports happy-path UX without console errors', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const root = document.querySelector('#app');
    const storage = createMemoryStorage();

    mountPOS(root, { storage });

    expect(root.querySelector('h1')?.textContent).toContain('Local POS MVP');

    root.querySelector('#item-name').value = 'Latte';
    root.querySelector('#item-price').value = '5.50';
    root.querySelector('#item-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const addToCart = root.querySelector('button[data-action="add"]');
    addToCart.click();

    root.querySelector('#checkout-cash').click();

    expect(root.textContent).toContain('Receipt (Latest)');
    expect(root.textContent).toContain('Payment: CASH');
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('shows Update/Cancel controls in edit mode', () => {
    const root = document.querySelector('#app');
    const storage = createMemoryStorage();
    mountPOS(root, { storage });

    root.querySelector('#item-name').value = 'Espresso';
    root.querySelector('#item-price').value = '3.00';
    root.querySelector('#item-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const editBtn = root.querySelector('button[data-action="edit"]');
    editBtn.click();

    expect(root.querySelector('#item-form button[type="submit"]')?.textContent).toBe('Update Item');
    expect(root.querySelector('#cancel-edit')).toBeTruthy();
    expect(root.querySelector('#item-name').value).toBe('Espresso');
    expect(root.querySelector('#item-price').value).toBe('3');
  });
});
