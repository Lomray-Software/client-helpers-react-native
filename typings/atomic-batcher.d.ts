declare module 'atomic-batcher' {
  type TBCallback = (messages: any, cb: CallableFunction) => void;

  function batcher(callback: TBCallback): CallableFunction;

  export default batcher;
}
