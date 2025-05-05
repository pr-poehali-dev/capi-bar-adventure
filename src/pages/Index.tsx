
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ghost, Sparkles, Trophy, Egg } from "lucide-react";

const Index = () => {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Array<{id: number, text: string, assignedTo: string | null, completed: boolean}>>([]);
  const [inventory, setInventory] = useState<Array<{id: number, name: string, foundBy: string, isLegendary?: boolean, image?: string, description?: string, isPashalka?: boolean}>>([]);
  
  const capybaras = [
    {
      id: "brownie",
      name: "Брауни",
      description: "Голубые глаза и детёныш",
      image: "https://cdn.poehali.dev/files/ba91ccd4-d086-4e7c-8119-3450cd799af1.png",
      busy: false
    },
    {
      id: "calamansi",
      name: "Каламанси",
      description: "Любит гибридные фрукты и имеет детёныша",
      image: "https://cdn.poehali.dev/files/d5e4af24-8c04-41f5-a4fe-10fe1f60f175.png",
      busy: false
    },
    {
      id: "spring",
      name: "Весна",
      description: "Любит мандарины и полотенца",
      image: "https://cdn.poehali.dev/files/76f911de-889b-4cc0-b9e8-55802ce7afc0.png",
      busy: false
    }
  ];

  const [capy, setCapy] = useState(capybaras);
  
  const addTask = () => {
    if (taskInput.trim() !== "") {
      // Проверяем, не является ли задание пасхалкой
      const isPashalkaTask = taskInput.toLowerCase().includes("найдите пасхалку");
      
      // Если это пасхалка, сразу добавляем секретный предмет
      if (isPashalkaTask) {
        setInventory([...inventory, {
          id: Date.now(),
          name: "Птица пасхалочек",
          foundBy: "Система",
          isPashalka: true,
          isLegendary: true,
          image: "https://cdn.poehali.dev/files/52ad634b-9a46-45d6-8cc5-cce6f6038a4c.jpeg",
          description: "АОАОАО ПАСХАЛКО ПАСХАЛКО ПАСХАЛОЧКА!!!"
        }]);
      }
      
      setTasks([...tasks, {
        id: Date.now(),
        text: taskInput, 
        assignedTo: null,
        completed: false
      }]);
      setTaskInput("");
    }
  };

  const assignTask = (taskId: number, capybaraId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, assignedTo: capybaraId} : task
    ));
    
    setCapy(capy.map(c => 
      c.id === capybaraId ? {...c, busy: true} : c
    ));
    
    // Имитация поиска - через 3 секунды будет найден предмет
    setTimeout(() => {
      // Шанс найти легендарный артефакт - 5%
      const isLegendary = Math.random() < 0.05;
      
      if (isLegendary) {
        // Нашли легендарный артефакт!
        const capyName = capy.find(c => c.id === capybaraId)?.name;
        
        setInventory([...inventory, {
          id: Date.now(),
          name: "Эссенция легендарного мема",
          foundBy: capyName || "",
          isLegendary: true,
          image: "https://cdn.poehali.dev/files/7d42e487-6cc2-4424-8e33-d160c69da73c.png"
        }]);
      } else {
        const magicItems = [
          "Волшебная палочка", "Флакон невидимости", "Сверкающий кристалл",
          "Древний талисман", "Светящийся амулет", "Книга заклинаний",
          "Магическая шляпа", "Зачарованный ключ", "Мистический свиток"
        ];
        
        const randomItem = magicItems[Math.floor(Math.random() * magicItems.length)];
        const capyName = capy.find(c => c.id === capybaraId)?.name;
        
        setInventory([...inventory, {
          id: Date.now(),
          name: randomItem,
          foundBy: capyName || ""
        }]);
      }
      
      // Освобождаем капибару и отмечаем задачу выполненной
      setCapy(capy.map(c => 
        c.id === capybaraId ? {...c, busy: false} : c
      ));
      
      setTasks(tasks.map(task => 
        task.id === taskId ? {...task, completed: true} : task
      ));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8f3e6] p-6">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#6b4226] mb-2">Капибары и Заброшенный Замок</h1>
          <p className="text-[#8c684a]">Отправь капибар на поиски магических предметов</p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {capy.map((capybara) => (
            <Card key={capybara.id} className="border-2 border-[#d5b89a] bg-[#fdf7e9]">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{capybara.name}</span>
                  {capybara.busy && <Badge variant="outline" className="bg-amber-200">На задании</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="h-48 flex items-center justify-center mb-4">
                  <img 
                    src={capybara.image} 
                    alt={capybara.name} 
                    className="h-full object-contain"
                  />
                </div>
                <p className="text-sm text-[#6b4226] mb-3">{capybara.description}</p>
                
                {!capybara.busy && tasks.filter(t => !t.assignedTo && !t.completed).length > 0 && (
                  <div className="mt-4">
                    <select 
                      className="w-full p-2 mb-2 rounded border border-[#d5b89a]"
                      onChange={(e) => {
                        const taskId = parseInt(e.target.value);
                        if (taskId) assignTask(taskId, capybara.id);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Выбрать задание</option>
                      {tasks
                        .filter(task => !task.assignedTo && !task.completed)
                        .map(task => (
                          <option key={task.id} value={task.id}>
                            {task.text}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-[#d5b89a] bg-[#fdf7e9] md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ghost className="h-5 w-5" />
                Заброшенный замок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-[#e9e1d3] rounded-lg mb-4 min-h-[200px] flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold mb-4">Замок ждет исследователей!</h3>
                <p className="text-[#6b4226] mb-4">Отправь капибар на поиски, нажав "Выбрать задание" и выбрав задачу.</p>
                {capy.some(c => c.busy) && (
                  <div className="animate-pulse text-purple-700 font-medium">
                    <p>Капибара ищет магические предметы...</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Введите новое задание..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="border-[#d5b89a]"
                />
                <Button onClick={addTask} className="bg-[#8c684a] hover:bg-[#6b4226]">
                  Добавить
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Задания:</h3>
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500">Нет заданий. Добавьте первое!</p>
                ) : (
                  <ul className="space-y-2">
                    {tasks.map(task => (
                      <li 
                        key={task.id} 
                        className={`p-2 rounded border border-[#d5b89a] ${task.completed ? 'bg-green-50' : 'bg-[#fdf7e9]'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={task.completed ? 'line-through text-gray-500' : ''}>
                            {task.text}
                          </span>
                          <div>
                            {task.assignedTo && !task.completed && (
                              <Badge variant="outline" className="bg-amber-200">
                                Выполняется
                              </Badge>
                            )}
                            {task.completed && (
                              <Badge variant="outline" className="bg-green-200">
                                Выполнено
                              </Badge>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-[#d5b89a] bg-[#fdf7e9]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Магические находки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px]">
                {inventory.length === 0 ? (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Инвентарь пуст. Отправьте капибар на поиски!</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {inventory.map(item => (
                      <li 
                        key={item.id} 
                        className={`p-3 ${item.isPashalka ? 'bg-purple-100 border-purple-400' : item.isLegendary ? 'bg-amber-100 border-amber-400' : 'bg-[#f0e9d9] border-[#d5b89a]'} rounded-lg border ${item.isLegendary || item.isPashalka ? 'animate-pulse' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${item.isPashalka ? 'text-purple-700' : item.isLegendary ? 'text-amber-700' : ''}`}>
                                {item.name}
                              </span>
                              {item.isLegendary && !item.isPashalka && <Trophy className="h-4 w-4 text-amber-500" />}
                              {item.isPashalka && <Egg className="h-4 w-4 text-purple-500" />}
                            </div>
                            <p className="text-sm text-[#8c684a]">Нашла: {item.foundBy}</p>
                            {item.description && (
                              <p className="text-xs italic mt-1 text-purple-500 font-bold">{item.description}</p>
                            )}
                          </div>
                          {item.image && (
                            <div className="h-16 w-16">
                              <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
