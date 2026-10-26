# Product fallback photos

The demo catalog (`server/utils/seed.js`) creates products without an image. The storefront shows one of these
photos for any product that has no `imageUrl`; the helper in `src/lib/product-images.ts` picks the photo.

All photos are from [Unsplash](https://unsplash.com) and used under the
[Unsplash License](https://unsplash.com/license) (free for commercial and non-commercial use, attribution not
required but given here). Each photo was downloaded once, center-cropped to a square and re-encoded as an
800 x 800 JPEG (metadata stripped, 25 to 108 KB each), and is served from `public/images/products/`, so nothing is
hot-linked at runtime.

| File | Subject | Photographer | Source | License |
| --- | --- | --- | --- | --- |
| `chair.jpg` | Black molded chair with wooden legs on a teal backdrop | Suchit Poojari | https://unsplash.com/photos/black-chair-with-wooden-legs-ljRiZl00n18 | Unsplash License |
| `car.jpg` | Red convertible scale model on a pale studio backdrop (backdrop extended to a square) | Gimmel Magaway | https://unsplash.com/photos/red-convertible-coupe-on-white-background-4E0u7VsfGms | Unsplash License |
| `computer.jpg` | Open silver laptop on a white table | Giorgio Trovato | https://unsplash.com/photos/macbook-pro-on-white-table-8krX0HkXw8c | Unsplash License |
| `keyboard.jpg` | White corded keyboard on a white surface | Olena Bohovyk | https://unsplash.com/photos/white-corded-computer-keyboard-on-white-surface-cHlK4sZXOQo | Unsplash License |
| `mouse.jpg` | Gray and black cordless mouse | Oscar Ivan Esquivel Arteaga | https://unsplash.com/photos/closeup-photo-of-gray-and-black-cordless-mouse-ZtxED1cpB1E | Unsplash License |
| `bike.jpg` | Lime green mountain bike in a studio | Marios Gkortsilas | https://unsplash.com/photos/a-bright-yellow-mountain-bike-on-a-dark-background-l6vgrZlPuIU | Unsplash License |
| `ball.jpg` | Soccer ball on grass | Carlos Felipe Ramírez Mesa | https://unsplash.com/photos/a-football-ball-on-the-grass-OCH9nlz0BY4 | Unsplash License |
| `gloves.jpg` | Pair of gray knitted gloves | Ingmar | https://unsplash.com/photos/a-pair-of-gloves-sitting-on-top-of-a-wooden-floor-PCw9W3FoJUo | Unsplash License |
| `pants.jpg` | Folded blue jeans, flat lay | TuanAnh Blue | https://unsplash.com/photos/a-pair-of-blue-jeans-on-a-white-background-9yoXrG6Er_g | Unsplash License |
| `shirt.jpg` | Plain white t-shirt, flat lay | mockupbee | https://unsplash.com/photos/a-white-shirt-on-a-white-background-4rUYuwJ2vGw | Unsplash License |
| `table.jpg` | Low wooden coffee table | Suryakant Prajapati | https://unsplash.com/photos/a-rustic-wooden-coffee-table-with-books-and-vase-6OCmgz7n4fM | Unsplash License |
| `shoes.jpg` | Pair of brown leather brogue boots | Noah Smith | https://unsplash.com/photos/a-pair-of-brown-boots-with-a-tan-background-R4xOiCIeOUs | Unsplash License |
| `hat.jpg` | Plain white baseball cap on gray | personalgraphic.com | https://unsplash.com/photos/a-white-baseball-cap-on-a-gray-background-ozdzzeBu4Go | Unsplash License |
| `towels.jpg` | Two folded bath towels (burgundy and teal) | Rinku Shemar | https://unsplash.com/photos/a-stack-of-three-towels-sitting-on-top-of-a-table-j0QueaYgJtw | Unsplash License |
| `soap.jpg` | Handmade soap bars, flat lay | Sincerely Media | https://unsplash.com/photos/white-and-black-box-on-white-surface-7gZW8ZX6BqY | Unsplash License |
| `tuna.jpg` | Fresh raw tuna steaks (cropped and lightly sharpened) | MChe Lee | https://unsplash.com/photos/freshly-cut-raw-tuna-steaks-displayed-for-sale-ttyvIxpnfN0 | Unsplash License |
| `chicken.jpg` | Roast chicken with herbs in a pan | Anto Meneghini | https://unsplash.com/photos/roasted-chicken-with-herbs-and-vegetables-in-a-pan-mlQ2_HrjccU | Unsplash License |
| `fish.jpg` | Two whole trout on a plate | Gregor Moser | https://unsplash.com/photos/two-silver-fishes-on-round-white-ceramic-plate-QGIJUqnEpCY | Unsplash License |
| `cheese.jpg` | Cheese wedges with basil on a board | David Foodphototasty | https://unsplash.com/photos/a-couple-of-pieces-of-cheese-sitting-on-top-of-a-wooden-cutting-board-JJcT6VJWDlg | Unsplash License |
| `bacon.jpg` | Crispy bacon strips on a white plate | James Trenda | https://unsplash.com/photos/a-white-plate-topped-with-bacon-strips-on-top-of-a-table-JnfaOH0Yqug | Unsplash License |
| `pizza.jpg` | Margherita pizza | Aurélien Lemasson-Théobald | https://unsplash.com/photos/round-cooked-pizza-x00CzBt4Dfk | Unsplash License |
| `salad.jpg` | Salad bowl, top view | Anh Nguyen | https://unsplash.com/photos/vegetable-and-meat-on-bowl-kcA-c3f_3FE | Unsplash License |
| `sausages.jpg` | Grilled sausages on a wooden board | Diego Arenas de Rodrigo | https://unsplash.com/photos/several-grilled-sausages-arranged-on-a-wooden-board-A5uJBTqz6D4 | Unsplash License |
| `chips.jpg` | Potato chips, close up | Mustafa Bashari | https://unsplash.com/photos/brown-chips-on-brown-textile-S4PC4SeKwKg | Unsplash License |
| `generic-1.jpg` | Kraft cardboard box on a white surface | Christopher Bill | https://unsplash.com/photos/brown-cardboard-box-on-white-surface-3l19r5EOZaw | Unsplash License |
| `generic-2.jpg` | White gift box with a green ribbon | Khanh Do | https://unsplash.com/photos/a-white-gift-box-with-a-green-ribbon-bow-o0wb7fpyvRo | Unsplash License |
| `generic-3.jpg` | Kraft paper shopping bag | Dmitry Mashkin | https://unsplash.com/photos/brown-paper-bag-on-white-textile-adCT4qOQeY4 | Unsplash License |
| `generic-4.jpg` | Sunglasses and ceramic arch still life | Kate Laine | https://unsplash.com/photos/a-pair-of-sunglasses-sitting-on-top-of-a-white-object-7zVkSRYgQ4k | Unsplash License |

## Notes

- No photo has a watermark or a person in it. `bike.jpg` shows the bike maker's name printed on the frame.
- `tuna.jpg` is the softest photo of the set (shallow depth of field in the original); it is the first one to
  replace if a sharper tuna photo turns up.
- `soap.jpg` is listed on Unsplash with the title "white and black box on white surface" but shows soap bars.
- Photographer names and page URLs were taken from Unsplash's listing pages when the photos were chosen.
