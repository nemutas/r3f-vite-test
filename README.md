# About
In this application, we are trying to build an environment using [Vite](https://vitejs.dev/).<br>
The following has been set up.

* Building a React environment with Typescript
* Deploy to GitHub Pages using gh-pages

https://nemutas.github.io/r3f-vite-test/

# Create project
### insetall
[Getting Started](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

npm 7.x
```
npm create vite@latest <project name> -- --template react-ts
```

npm 6.x
```
npm create vite@latest <project name> --template react-ts
```

At this point, `node_modules` will not be installed, so the following must be done.
```
npm install
```

### tsconfig.json
If library checks are enabled, they should be disabled.
```
"skipLibCheck": true,
```

# Github Pages settings
### install package
```
npm i -D gh-pages
```

### package.json
Add the following settings.
```.json
"homepage": "https://<your name>.github.io/<project name>/",

"scripts": {
	"deploy": "npm run build && gh-pages -d dist"
},
```
Vite defaults to `dist` as the output folder at build, so use `gh-pages -d dist`.

### vite.config.ts
[Static Asset Handling](https://vitejs.dev/guide/assets.html)<br>
If you want to create a `Public` folder directly under the project to manage resources, additional settings are required in `vite.config.ts`.
```.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/<project name>/'
})
```

If you want to manage something like `public/images/hoge.jpg`, The code to retrieve the path is as follows.
[in my code](https://github.com/nemutas/r3f-vite-test/blob/7e5baac352d22200af23acdf06996df6b3e3bfa3/src/components/three/TCanvas.tsx#L21)
```.ts
const path = (name: string) => `${import.meta.env.BASE_URL}images/${name}.jpg`
```

# Plugin
### [vite-plugin-glsl](https://www.npmjs.com/package/vite-plugin-glsl)
```
npm i -D vite-plugin-glsl
```

`vite.config.ts`
```.ts
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	plugins: [glsl()]
})
```

if you use typescript, must be add type define file.<br>
`glsl.d.ts`
```.ts
declare module '*.glsl' {
	const value: string
	export default value
}
```
