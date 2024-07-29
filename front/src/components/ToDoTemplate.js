import "./ToDoTemplate.css";

function TodoTemplate({children}) {
    return (
        <div className="TodoTemplate">
            <div className="app-title">챌린지 현황</div>
            <div className="progress">진행도</div>
            <div className="content">{children}</div>
            
        </div>
    )
}

export default TodoTemplate;