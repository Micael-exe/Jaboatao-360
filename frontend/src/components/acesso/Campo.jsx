export default function Campo({ id, rotulo, children, ...props }) {
  return (
    <div className="perfil-campo">
      <label htmlFor={id}>{rotulo}</label>
      {children ?? <input id={id} className="input" {...props} />}
    </div>
  )
}
