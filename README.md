# Trace the current location in a program
Allows access to the file, func, line and col while executing

# Prerequisites
- node 
- yarn

# Written in Typescript
- traceloc.d.ts local

# Examples
```
import {TraceLoc} from "traceloc";

console.log(`location=${TraceLoc.here()}`);
```

# Build and test
```
yarn test
```

You can also build separately
```
yarn build
```

# API

