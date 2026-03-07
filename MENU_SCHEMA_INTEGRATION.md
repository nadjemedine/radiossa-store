# Menu, PreFooter & Footer Schema Integration

## ✅ Changes Completed

### 1. **Menu Component** - Dynamic Data from `sideMenu` Schema

The Menu component now fetches and displays data from the `sideMenu` schema in Sanity CMS.

#### What's Now Configurable via Sanity Studio:

**Menu Header:**
- `menuTitle` - Custom title at the top of the menu (default: "Menu")

**Collections Section:**
- `collectionsHeading` - Custom heading text (default: "MÉTAVERS DES COLLECTIONS")
- `showCollectionsHeading` - Toggle to show/hide heading
- `collectionsHeadingAlignment` - Left, Center, or Right
- `collectionsHeadingStyle` - Normal, Bold, Italic, or Bold Italic
- `collectionsHeadingColor` - Custom hex color for heading
- `showCollections` - Toggle to show/hide entire collections section
- `collections` - Specific categories to display (leave empty to show all)

**Pages Section:**
- `pagesHeading` - Heading for pages section (default: "Pages")
- `showPages` - Toggle to show/hide pages section
- `pages[]` - Array of custom pages with:
  - `title` - Display name
  - `pageType` - Type (home, cart, tracking, contact, external, whatsapp, instagram, facebook)
  - `url` - External URL (for external links and social media)
  - `icon` - Custom icon image

**Menu Footer:**
- `showFooterInfo` - Toggle to show/hide footer info section
- `footerText` - Custom text above contact info

#### Features:
✅ Dynamic menu configuration from Sanity CMS
✅ Custom pages with icons
✅ External links support (WhatsApp, Instagram, Facebook, etc.)
✅ Styled collections heading with alignment and color options
✅ Selective category display
✅ Fallback to default behavior if no configuration exists

---

### 2. **PreFooter Component** - Already Integrated ✓

The PreFooter component was already fetching data from the `preFooter` schema.

**Configurable in Sanity Studio:**
- `enabled` - Toggle on/off
- `backgroundColor` - Background color for entire section
- `rectangle1-4` - Four customizable rectangles with:
  - `title` - Main heading
  - `subtitle` - Description text
  - `icon` - Custom icon image
  - `iconSize` - Size in pixels
  - `backgroundColor` - Rectangle background color
  - `textColor` - Text color
  - `iconColor` - Icon color
  - `widthPercentage` - Width (25% for 4 columns, 50% for 2 columns, etc.)

---

### 3. **Footer Component** - Already Integrated ✓

The Footer component was already fetching data from the `footer` schema.

**Configurable in Sanity Studio:**
- `backgroundColor` - Footer background color
- `textColor` - Text color
- `iconColor` - Icon color
- `subLogo` - Small logo above title
- `subLogoWidth` - Logo width in pixels
- `title` - Footer title
- `titleAlignment` - Left, Center, Right
- `description` - Footer description
- `descriptionAlignment` - Left, Center, Right
- `socialLinks[]` - Social media links with platform and URL
- `socialLinksAlignment` - Left, Center, Right
- `quickLinks[]` - Quick navigation links
- `quickLinksAlignment` - Left, Center, Right
- `contactInfo` - Contact details (phone, email, address)
- `contactInfoAlignment` - Left, Center, Right
- `copyrightText` - Copyright text
- `copyrightAlignment` - Left, Center, Right

---

## 📋 How to Use in Sanity Studio

### Configure the Side Menu:

1. Open Sanity Studio (`http://localhost:3000/studio`)
2. Go to **Side Menu** document
3. Fill in the following:

**Basic Configuration:**
```
Menu Title: "My Menu"
Collections Heading: "Shop by Category"
Show Collections Heading: ✓
Collections Heading Alignment: left
Collections Heading Style: bold-italic
Collections Heading Color: #000000
Show Collections: ✓
```

**Add Specific Collections (Optional):**
- Click "Add new" in Collections field
- Select specific categories to display
- Leave empty to show all categories

**Add Pages:**
```
Pages Heading: "Quick Links"
Show Pages: ✓

Add Page 1:
  Title: "Home"
  Page Type: home
  Icon: [upload icon]

Add Page 2:
  Title: "Track Order"
  Page Type: tracking

Add Page 3:
  Title: "WhatsApp"
  Page Type: whatsapp
  URL: https://wa.me/213555555555
```

**Footer Info:**
```
Show Footer Info: ✓
Footer Text: "Contact Us"
```

---

## 🎨 Example Configurations

### Example 1: Minimal Menu
```
Menu Title: "Menu"
Show Collections: ✓
Show Pages: ✗
Show Footer Info: ✓
Footer Text: "Need Help?"
```

### Example 2: Full Featured Menu
```
Menu Title: "☰ Navigation"
Collections Heading: "Nos Collections"
Collections Heading Style: bold
Collections Heading Color: #FF6B6B
Show Collections: ✓
Collections: [Select 5 featured categories]

Pages:
  - Home (with house icon)
  - Cart (with cart icon)
  - WhatsApp (external link)
  - Instagram (external link)

Footer Text: "Suivez-nous"
```

### Example 3: Social Media Focus
```
Menu Title: "Menu"
Show Collections: ✗

Pages:
  - Instagram → https://instagram.com/yourstore
  - Facebook → https://facebook.com/yourstore
  - WhatsApp → https://wa.me/213555555555

Footer Text: "Contact"
```

---

## 🔧 Code Changes Summary

### Menu.js Updates:

1. **Added State:**
```javascript
const [menuData, setMenuData] = useState(null);
```

2. **Enhanced Fetch Query:**
```javascript
const menuQuery = `*[_type == "sideMenu"][0]{
    menuTitle,
    collectionsHeading,
    showCollectionsHeading,
    collectionsHeadingAlignment,
    collectionsHeadingStyle,
    collectionsHeadingColor,
    showCollections,
    "collections": collections[]->{
        _id,
        name,
        "slug": slug.current
    },
    pagesHeading,
    showPages,
    pages[]{
        title,
        pageType,
        url,
        icon
    },
    showFooterInfo,
    footerText
}`;
```

3. **Dynamic Rendering:**
- Conditional rendering based on `show...` flags
- Style application from schema values
- Custom page handling with different page types
- External link support

---

## ⚠️ Important Notes

1. **First Time Setup:**
   - You must create at least one `sideMenu` document in Sanity Studio
   - If no menu data exists, defaults will be used

2. **Collections Priority:**
   - If you select specific collections in `collections` field, only those will show
   - If left empty, all categories will display

3. **Page Types:**
   - `home` - Navigates to store homepage
   - `cart` - Opens shopping cart
   - `tracking` - Order tracking page
   - `contact` - Contact page
   - `external`, `whatsapp`, `instagram`, `facebook` - Opens URL in new tab

4. **Icons:**
   - Upload small icons (recommended: 18x18px or 24x24px)
   - Icons are optional for pages
   - Use PNG or SVG format for best quality

---

## 🚀 Testing

1. **Run Development Server:**
```bash
npm run dev
```

2. **Open Sanity Studio:**
```
http://localhost:3000/studio
```

3. **Configure Menu:**
   - Create/edit Side Menu document
   - Add your configuration
   - Publish changes

4. **Test on Frontend:**
   - Open your store
   - Click menu button (hamburger icon)
   - Verify all configurations appear correctly

---

## 📁 Files Modified

1. ✅ `src/components/Menu.js` - Complete rewrite with dynamic data
2. ✅ `src/components/PreFooter.js` - Already integrated (no changes needed)
3. ✅ `src/components/Footer.js` - Already integrated (no changes needed)

---

## 🎯 Benefits

✅ **Full CMS Control** - Configure menu without code changes
✅ **Flexible Pages** - Add/remove pages from Sanity Studio
✅ **Custom Styling** - Control colors, alignment, and styles
✅ **Social Integration** - Direct links to social platforms
✅ **Selective Display** - Show/hide sections as needed
✅ **Icon Support** - Custom icons for better UX
✅ **Fallback System** - Works even with minimal configuration

---

## 🔮 Future Enhancements (Optional)

- Multi-language support for menu items
- Mega menu with product images
- Promotional banners in menu
- Search functionality
- Recently viewed items
- Wishlist access from menu
