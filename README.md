# Academic Search URL Generator

Aplikasi web untuk menggenerate URL pencarian yang dioptimalkan untuk database akademik IEEE Xplore dan Scopus.

## Fitur Utama

- **Database Support**: IEEE Xplore dan Scopus
- **Flexible Search Terms**: Multiple term groups dengan operator boolean (AND/OR)
- **Year Range Filtering**: Kontrol rentang tahun publikasi
- **Advanced Options**: Field selection dan hasil per halaman
- **Real-time URL Generation**: URL digenerate secara real-time saat input berubah
- **Copy & Open**: Copy URL ke clipboard atau buka di tab baru
- **Responsive Design**: Tampilan yang responsif untuk desktop dan mobile
- **Swiss Design**: Interface yang bersih dan profesional

## Cara Penggunaan

### 1. Pilih Database
- Klik tab "IEEE Xplore" atau "Scopus" untuk memilih database target

### 2. Tambahkan Search Terms
- Setiap term group dapat memiliki multiple search terms
- Gunakan operator AND/OR untuk menggabungkan terms dalam satu group
- Klik "Add Term Group" untuk membuat group baru

### 3. Set Year Range
- Atur rentang tahun publikasi menggunakan input field atau slider
- Range default: 2020-2024

### 4. Konfigurasi Opsi Advanced
- **Search Field**: Pilih field yang akan dicari (All Metadata, Title, Abstract, dll)
- **Results per Page**: Jumlah hasil per halaman (25, 50, 100, 200)

### 5. Copy atau Buka URL
- URL akan digenerate secara real-time di bagian bawah form
- Klik icon copy untuk copy URL ke clipboard
- Klik "Open in New Tab" untuk membuka URL di tab baru

## Contoh Penggunaan

### Contoh 1: Neural Decoding Research
```
Term Group 1:
- Field: All Metadata
- Terms: "neural decoding" OR "brain decoding"
- Operator: (untuk group ini)

Term Group 2:
- Field: All Metadata  
- Terms: "visual cortex" OR "image reconstruction"
- Operator: (untuk group ini)

Year Range: 2019-2026
```

### Contoh 2: Machine Learning in Healthcare
```
Term Group 1:
- Field: Title
- Terms: "machine learning" AND "healthcare"
- Operator: OR

Term Group 2:
- Field: Abstract
- Terms: "medical diagnosis" OR "clinical decision"
- Operator: OR

Year Range: 2020-2024
```

## Struktur URL yang Dihasilkan

### IEEE Xplore
Menggunakan parameter `queryText` dengan encoding khusus untuk complex boolean queries:
```
https://ieeexplore.ieee.org/search/searchresult.jsp?action=search&newsearch=true&matchBoolean=true&queryText=(%22All%20Metadata%22:%22neural%20decoding%22%20OR%20%22All%20Metadata%22:%22brain%20decoding%22)%20AND%20(%22All%20Metadata%22:%22visual%20cortex%22%20OR%20%22All%20Metadata%22:%22image%20reconstruction%22)&ranges=2019_2026_Year
```

### Scopus  
Menggunakan parameter `s` untuk search query dengan encoding URL:
```
https://www.scopus.com/results/results.uri?sort=plf-f&src=s&sid=...&sot=a&sdt=a&sl=211&s=%28+%28+TITLE-ABS-KEY+%28+%22neural+decoding%22+%29+OR+TITLE-ABS-KEY+%28+%22brain+decoding%22+%29+%29+AND+%28+TITLE-ABS-KEY+%28+%22visual+cortex%22+%29+OR+TITLE-ABS-KEY+%28+%22image+reconstruction%22+%29+%29+%29+AND+PUBYEAR+%26gt%3B+2019+AND+PUBYEAR+%26lt%3B+2027&origin=searchadvanced&editSaveSearch=&limit=200
```

## Teknologi yang Digunakan

- **HTML5**: Struktur semantic dan modern
- **CSS3**: Swiss design principles dengan custom properties
- **Vanilla JavaScript (ES6+)**: Modular architecture dengan ES6 modules
- **Google Fonts**: Inter dan JetBrains Mono untuk typography
- **Responsive Design**: Mobile-first approach

## Browser Compatibility

- **Modern Browsers**: Chrome 61+, Firefox 60+, Safari 11+, Edge 79+
- **Features Used**: ES6 Modules, URL API, Clipboard API
- **Fallbacks**: Older clipboard methods untuk browser lama

## Keyboard Shortcuts

- `Ctrl/Cmd + C`: Copy URL (when URL preview is focused)
- `Ctrl/Cmd + Enter`: Open URL in new tab
- `Escape`: Clear form

## File Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling (Swiss design)
├── scripts/
│   ├── app.js          # Main application entry point
│   └── modules/
│       ├── search-generator.js  # URL generation logic
│       └── ui-manager.js        # UI interaction management
└── README.md           # Documentation
```

## Development Notes

### Modular Architecture
- **SearchGenerator**: Handles URL generation untuk IEEE dan Scopus
- **UIManager**: Manages user interface dan state
- **App**: Main application coordinator

### Design Principles
- **Swiss Design**: Clean, precise, functional
- **Accessibility**: Focus management, keyboard shortcuts, semantic HTML
- **Performance**: Efficient DOM updates, minimal re-renders
- **User Experience**: Real-time feedback, intuitive controls

### URL Encoding
IEEE dan Scopus menggunakan encoding yang berbeda untuk search queries:
- IEEE: Menggunakan colon (:) dan quotes untuk field-specific search
- Scopus: Menggunakan pattern TITLE-ABS-KEY() untuk field specification

## License

MIT License - Free untuk penggunaan akademik dan komersial.

## Author

MiniMax Agent - AI Assistant untuk academic research tools.