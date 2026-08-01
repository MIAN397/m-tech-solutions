import os
from PIL import Image

def generate_favicons():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(base_dir, 'public')
    transparent_logo_path = os.path.join(public_dir, 'logo_transparent.png')

    if not os.path.exists(transparent_logo_path):
        raise FileNotFoundError(f"Source logo not found at {transparent_logo_path}")

    base_img = Image.open(transparent_logo_path).convert('RGBA')

    sizes = {
        'favicon-48x48.png': (48, 48),
        'favicon-32x32.png': (32, 32),
        'favicon-192x192.png': (192, 192),
        'favicon-512x512.png': (512, 512),
        'apple-touch-icon.png': (180, 180),
        'apple-touch-icon-precomposed.png': (180, 180),
    }

    for filename, sz in sizes.items():
        resized = base_img.resize(sz, Image.Resampling.LANCZOS)
        out_path = os.path.join(public_dir, filename)
        resized.save(out_path, 'PNG')
        print(f"Generated {filename} ({sz[0]}x{sz[1]})")

    # Generate multi-resolution ICO
    ico_img = base_img.resize((48, 48), Image.Resampling.LANCZOS)
    ico_path = os.path.join(public_dir, 'favicon.ico')
    ico_img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("Generated favicon.ico")

    # Generate SVG matching logo
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <circle cx="50" cy="50" r="49" fill="#0066FF" />
  <g fill="#FFFFFF">
    <rect x="20" y="20" width="14" height="60" rx="4" />
    <rect x="66" y="20" width="14" height="60" rx="4" />
    <path d="M 34 20 L 50 36 L 66 20 L 66 32 L 50 48 L 34 32 Z" />
    <path d="M 34 53 H 66 L 50 69 Z" />
  </g>
</svg>
'''
    with open(os.path.join(public_dir, 'favicon.svg'), 'w') as f:
        f.write(svg_content)
    print("Generated favicon.svg")

if __name__ == '__main__':
    generate_favicons()
