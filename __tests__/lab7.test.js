describe('Basic user flow for Website', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    expect(numProducts).toBe(20);
  });

  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    const prodItemsData = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map((item) => item.data);
    });

    const allArePopulated = prodItemsData.every((item) => {
      return (
        item.title !== undefined &&
        item.title !== '' &&
        item.price !== undefined &&
        item.price !== '' &&
        item.image !== undefined &&
        item.image !== ''
      );
    });

    expect(allArePopulated).toBe(true);
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const buttonText = await page.$eval('product-item', (item) => {
      const button = item.shadowRoot.querySelector('button');
      button.click();
      return button.innerText;
    });

    expect(buttonText).toBe('Remove from Cart');
  }, 2500);

  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    await page.$$eval('product-item', (items) => {
      items.forEach((item) => {
        const button = item.shadowRoot.querySelector('button');

        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);

    expect(cartCount).toBe('20');
  }, 10000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();

    const allButtonsCorrect = await page.$$eval('product-item', (items) => {
      return items.every((item) => {
        const button = item.shadowRoot.querySelector('button');
        return button.innerText === 'Remove from Cart';
      });
    });

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);

    expect(allButtonsCorrect).toBe(true);
    expect(cartCount).toBe('20');
  }, 10000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    await page.$$eval('product-item', (items) => {
      items.forEach((item) => {
        const button = item.shadowRoot.querySelector('button');

        if (button.innerText === 'Remove from Cart') {
          button.click();
        }
      });
    });

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);

    expect(cartCount).toBe('0');
  }, 10000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();

    const allButtonsCorrect = await page.$$eval('product-item', (items) => {
      return items.every((item) => {
        const button = item.shadowRoot.querySelector('button');
        return button.innerText === 'Add to Cart';
      });
    });

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);

    expect(allButtonsCorrect).toBe(true);
    expect(cartCount).toBe('0');
  }, 10000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[]');
  });
});