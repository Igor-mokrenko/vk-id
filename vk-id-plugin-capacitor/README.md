# vk-id-plugin-capacitor

capacitor plugin for vk id native sdk

## Install

```bash
npm install vk-id-plugin-capacitor
npx cap sync
```

## API

<docgen-index>

* [`auth(...)`](#auth)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### auth(...)

```typescript
auth(options: IAuthProps) => Promise<IAuthResult>
```

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#iauthprops">IAuthProps</a></code> |

**Returns:** <code>Promise&lt;<a href="#iauthresult">IAuthResult</a>&gt;</code>

--------------------


### Interfaces


#### IAuthResult

| Prop          | Type                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| **`data`**    | <code>{ state: string; code: string; deviceId: string; redirectURI: string \| null; }</code> |
| **`success`** | <code>boolean</code>                                                                         |
| **`error`**   | <code>string</code>                                                                          |


#### IAuthProps

| Prop                | Type                  |
| ------------------- | --------------------- |
| **`clientId`**      | <code>string</code>   |
| **`clientSecret`**  | <code>string</code>   |
| **`state`**         | <code>string</code>   |
| **`codeChallenge`** | <code>string</code>   |
| **`scope`**         | <code>string[]</code> |

</docgen-api>
