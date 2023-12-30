import { useEffect, useState } from "react"
import { useGetText } from "./hooks/useGetText";

const regex = new RegExp(/[a-zA-Z0-9 ,.]/);
const notKey = new RegExp(/(Backspace|Tab|Enter|Shift|Control|Alt|CapsLock|Meta|Escape|PageUp|PageDown|End|Home|ArrowLeft|ArrowUp|ArrowRight|ArrowDown|Delete|F\d\d?|NumLock|ScrollLock|Pause|Insert|ContextMenu|PrintScreen)/);

interface GetClassProps {
  chartOne: string;
  chartTwo: string;
}

const getClass = ({ chartOne, chartTwo }: GetClassProps) => {
  if (!chartOne || !chartTwo) return;

  return chartOne === chartTwo ? 'border-green-300 text-green-300' : 'border-red-500 text-red-500';
}

const getTranslation = (textLength: number) => {
  const style = `translateX(calc(40% - ${textLength * 3}rem))`
  return style;
}

function App() {
  const { text: initialText } = useGetText();
  const [textLength, setTextLenght] = useState<number>(0);
  const [userInputTest, setUserInputTest] = useState<string>('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === 'Backspace') {
        setUserInputTest((prev) => {
          const length = prev.length;
          return prev.slice(0, length - 1);
        })
      }
  
      if (notKey.test(key || '')) return;
  
      if (regex.test(key || '')) {
        setUserInputTest((prev) => prev + key) 
    }
  }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setTextLenght(userInputTest.length);
  }, [userInputTest])

  useEffect(() => {
    if (textLength === 0) return;

    if (userInputTest[textLength - 1] === initialText[textLength - 1]) {
      console.log('correct');
    } else {
      console.log('wrong');
    }
  }, [textLength])

  return (
    <section className="grid place-items-center w-screen h-screen">
      <div className="w-screen relative overflow-hidden">
        <div className="absolute h-full w-1/4 left-0 top-0 z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(36,36,36,1) 50%, rgba(36,36,36,0) 100%)'
        }}
        ></div>
        <div className="w-full flex" style={{
          transform: getTranslation(textLength)
        }}>
          {initialText.split('').map((chart, idx) => (<span className={`flex-shrink-0 text-4xl text-gray-600 py-4 w-[3rem] rounded border border-gray-600 grid place-items-center transition-colors ${getClass({
            chartOne: chart,
            chartTwo: userInputTest[idx]
          })}
          })}`} key={idx}>{chart}</span>))}
        </div>
        <div className="absolute h-full w-1/4 right-0 top-0 z-10"
        style={{
          background: 'linear-gradient(270deg, rgba(36,36,36,1) 50%, rgba(36,36,36,0) 100%)'
        }}
        ></div>
      </div>
    </section>
  )
}

export default App
