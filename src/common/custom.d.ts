declare module "*.svg" {
    const content: any;
    export default content;
}

declare module 'react-linkify' {
    export default class Linkify extends React.Component<any, any> {
    }
}

declare module "*.json" {
    const value: any;
    export default value;
}