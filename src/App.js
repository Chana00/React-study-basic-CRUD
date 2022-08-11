import logo from "./logo.svg";
import "./App.css";
import { useState } from "react"; //hook

function HeaderCus(props) {
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault(); // 기본 동작 비활성화. 리로딩이 일어나는 것을 막는다
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const list = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    list.push(
      <li key={t.id}>
        <a
          id={t.id}
          href={"/read/" + t.id}
          onClick={(e) => {
            e.preventDefault();
            props.onChangeMode(Number(e.target.id));
          }}
        >
          {t.title}
        </a>
      </li>
    );
  }

  return (
    <nav>
      <ol>{list}</ol>
    </nav>
  );
}

function ArtiCus(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title" />
        </p>
        <p>
          <textarea name="body" placeholder="body" />
        </p>
        <p>
          <input type="submit" value="Create" />
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title" value={title} onChange={e => {
            setTitle(e.target.value);
          } }/>
        </p>
        <p>
          <textarea name="body" placeholder="body" value={body}  onChange={e => {
            setBody(e.target.value);
          } }/>
        </p>
        <p>
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
}

function App() {
  // const _mode = useState("WELCOME");
  // const mode = _mode[0];
  // const setMode = _mode[1];
  let content = null;
  let contextControl = null;

  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is ... " },
    { id: 2, title: "css", body: "css is ... " },
    { id: 3, title: "javascript", body: "javascript is ... " },
  ]);

  if (mode === "WELCOME") {
    content = <ArtiCus title="Welcome" body="Hello, WEB!"></ArtiCus>;
  } else if (mode === "READ") {
    let title, body = null;

    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <ArtiCus title={title} body={body}></ArtiCus>;
    contextControl = <li><a href={'/update/' + id} onClick = { e =>{
      e.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>;

  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "UPDATE") {
    let title, body = null;

    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content = <Update title={title} body={body} onUpdate= {(title, body)=> {
      const newTopics = [...topics];
      const updatedTopic = {id:id, title: title, body:body}
      for(let i=0; i<newTopics.length; i++) {
        if(newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>;
  }

  return (
    <div className="App">
      <HeaderCus
        title="REACT"
        onChangeMode={() => {
          setMode("WELCOME");
        }}
      ></HeaderCus>
      <Nav
        topics={topics}
        onChangeMode={(id) => {
          setMode("READ");
          setId(id);
        }}
      ></Nav>
      {content}
      <ui>
        <li><a href="/create" onClick={(e) => {
            e.preventDefault();
            setMode("CREATE");
          }}
        >create</a></li>
        {contextControl}
      </ui>
    </div>
  );
}

export default App;
