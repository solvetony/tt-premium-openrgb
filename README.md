# TT Premium OpenRGB

## Build

Requires Node.js and npm.

```sh
npm ci
npm run build
```

This creates `out/index.html`. Open that file directly in a browser. No web
server is required.

Select a key and edit its color. OpenRGB already provides configuration import
and export.

## Development

```sh
npm run lint
npm test
```

`src/data/x1-led-map.js` preserves the supplied protocol label order.
`src/data/x1-layout.js` independently defines physical positions. A is LED 5,
not LED 20 (F). LED 45 is the quote key immediately before Enter. LEDs 101
and 102 have no recorded position, so are preserved in JSON but have no invented
key. LED 109 also lights the analog-output indicator. The three round controls,
status indicators, roller, and mute are decorative and have no invented mapping.

## License

GPLv2.

X: [@quellemor](https://x.com/quellemor)
