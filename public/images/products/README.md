# Product Images

This directory contains product images for the ecommerce application.

## Adding New Product Images

1. **Image Format**: Use JPG, PNG, or SVG formats
2. **Image Size**: Recommended 400x400px or larger (square aspect ratio works best)
3. **File Naming**: Use descriptive names like `wireless-headphones.jpg`, `smart-watch.png`, etc.

## Current Products

Replace the `placeholder.svg` file or add new images for these products:

1. **Premium Wireless Headphones** - `headphones.jpg`
2. **Smart Fitness Watch** - `smartwatch.jpg`
3. **Wireless Charging Pad** - `charging-pad.jpg`
4. **Bluetooth Speaker** - `speaker.jpg`
5. **USB-C Hub** - `usb-hub.jpg`
6. **Wireless Mouse** - `mouse.jpg`

## Updating Product Images

To update a product's image:

1. Add your image file to this directory
2. Update the product in the database by modifying the `image_url` field to `/images/products/your-image-name.jpg`
3. Or use the backend API to update the product

## Example

If you add a file called `headphones.jpg`, update the product's image_url to:
```
/images/products/headphones.jpg
```