import React, { useState } from "react";

const NestedListForm = () => {
  const [items, setItems] = useState([]);

  // Função para adicionar um novo item principal
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      description: "",
      tags: [], // lista vazia
      tasks: [], // outra lista
    };
    setItems([...items, newItem]);
  };

  // Função para adicionar item à lista aninhada
  const addToNestedList = (itemId, listName, newValue) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            [listName]: [
              ...item[listName],
              { id: Date.now(), value: newValue },
            ],
          };
        }
        return item;
      }),
    );
  };

  // Função para remover item da lista aninhada
  const removeFromNestedList = (itemId, listName, nestedItemId) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            [listName]: item[listName].filter(
              (nestedItem) => nestedItem.id !== nestedItemId,
            ),
          };
        }
        return item;
      }),
    );
  };

  // Função para atualizar campo do item principal
  const updateMainField = (itemId, field, value) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    );
  };

  // Função para remover item principal
  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  return (
    <div className="container">
      <h2>Formulário com Listas Aninhadas</h2>
      <button onClick={addItem}>Adicionar Novo Item</button>

      {items.map((item) => (
        <div key={item.id} className="item-card">
          <div className="item-header">
            <h3>Item #{item.id}</h3>
            <button onClick={() => removeItem(item.id)} className="remove-btn">
              Remover Item
            </button>
          </div>

          {/* Campos principais */}
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateMainField(item.id, "name", e.target.value)}
              placeholder="Digite o nome"
            />
          </div>

          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              value={item.description}
              onChange={(e) =>
                updateMainField(item.id, "description", e.target.value)
              }
              placeholder="Digite a descrição"
              rows="3"
            />
          </div>

          {/* Lista de Tags */}
          <div className="nested-section">
            <label>Tags:</label>
            <div className="nested-list">
              {item.tags.map((tag) => (
                <div key={tag.id} className="nested-item">
                  <span>{tag.value}</span>
                  <button
                    onClick={() =>
                      removeFromNestedList(item.id, "tags", tag.id)
                    }
                    className="nested-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="add-nested">
                <input
                  type="text"
                  placeholder="Adicionar tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addToNestedList(item.id, "tags", e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    if (input.value.trim()) {
                      addToNestedList(item.id, "tags", input.value.trim());
                      input.value = "";
                    }
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Tarefas com mais campos */}
          <div className="nested-section">
            <label>Tarefas:</label>
            <div className="tasks-list">
              {item.tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.completed || false}
                    onChange={(e) => {
                      setItems(
                        items.map((i) => {
                          if (i.id === item.id) {
                            return {
                              ...i,
                              tasks: i.tasks.map((t) =>
                                t.id === task.id
                                  ? { ...t, completed: e.target.checked }
                                  : t,
                              ),
                            };
                          }
                          return i;
                        }),
                      );
                    }}
                  />
                  <span className={task.completed ? "completed" : ""}>
                    {task.value}
                  </span>
                  <button
                    onClick={() =>
                      removeFromNestedList(item.id, "tasks", task.id)
                    }
                    className="nested-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="add-nested">
                <input
                  type="text"
                  placeholder="Adicionar tarefa"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      const newTask = {
                        id: Date.now(),
                        value: e.target.value.trim(),
                        completed: false,
                      };
                      setItems(
                        items.map((i) => {
                          if (i.id === item.id) {
                            return {
                              ...i,
                              tasks: [...i.tasks, newTask],
                            };
                          }
                          return i;
                        }),
                      );
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    if (input.value.trim()) {
                      const newTask = {
                        id: Date.now(),
                        value: input.value.trim(),
                        completed: false,
                      };
                      setItems(
                        items.map((i) => {
                          if (i.id === item.id) {
                            return {
                              ...i,
                              tasks: [...i.tasks, newTask],
                            };
                          }
                          return i;
                        }),
                      );
                      input.value = "";
                    }
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <p className="empty-state">
          Nenhum item adicionado. Clique em "Adicionar Novo Item" para começar.
        </p>
      )}
    </div>
  );
};

export default NestedListForm;
