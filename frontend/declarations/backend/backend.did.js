export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Message = IDL.Record({ 'content' : IDL.Text, 'timestamp' : Time });
  return IDL.Service({
    'getMessages' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'sendMessage' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
