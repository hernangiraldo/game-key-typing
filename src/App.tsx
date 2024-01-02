import { useCallback, useEffect, useState } from 'react';
import { Chart, useGetText } from './hooks/useGetText.ts';

const regex = new RegExp(/[a-zA-Z0-9 ,.]/);
const notKey = new RegExp(
	/(Backspace|Tab|Enter|Shift|Control|Alt|CapsLock|Meta|Escape|PageUp|PageDown|End|Home|ArrowLeft|ArrowUp|ArrowRight|ArrowDown|Delete|F\d\d?|NumLock|ScrollLock|Pause|Insert|ContextMenu|PrintScreen)/,
);

type GetClassProps = {
	chart: Chart;
	typed: string;
	inputLength: number;
	idx: number;
};

const validateChart = ({ chart, typed, inputLength, idx }: GetClassProps): Chart => {
	if (idx >= inputLength) {
		chart.status = 'not-typed';
		return chart;
	}

	if (!chart || !typed) return chart;

	chart.status = chart.chart === typed ? 'correct' : 'incorrect';
	return chart;
};

const getTranslation = (textLength: number) => {
	return `translateX(calc(40% - ${textLength * 3}rem))`;
};

function App() {
	const { initialText } = useGetText();
	const [formattedText, setFormattedText] = useState<Chart[]>([]);
	const [textLength, setTextLength] = useState<number>(0);
	const [userInputTest, setUserInputTest] = useState<string>('');
	const [time, setTime] = useState<number>(60); // Initialize to 60 seconds
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [finalScore, setFinalScore] = useState<number>(0);

	useEffect(() => {
		const tmpParagraph: Chart[] = initialText.split('').map((char) => {
			return {
				chart: char,
				status: 'not-typed',
			};
		});

		setFormattedText(tmpParagraph);
	}, [initialText]);

	const getClass = (chart: Chart, idx: number) => {
		const validatedChart = validateChart({
			chart,
			typed: userInputTest[idx],
			inputLength: textLength,
			idx,
		});

		const { status } = validatedChart;

		return status === 'not-typed'
			? 'border-gray-600 text-gray-600'
			: status === 'correct'
				? 'border-green-400 text-green-400'
				: 'border-red-400 text-red-400';
	};

	const calculateScore = useCallback(() => {
		const total = formattedText.reduce((acc, curr) => {
			if (curr.status === 'correct') {
				acc++;
			}
			return acc;
		}, 0);

		return total / 5;
	}, [formattedText]);

	const onKeyDown = useCallback((event: KeyboardEvent) => {
		const key = event.key;
		if (key === 'Backspace') {
			setUserInputTest((prev) => {
				const length = prev.length;
				return prev.slice(0, length - 1);
			});
		}

		if (notKey.test(key || '')) return;

		if (regex.test(key || '')) {
			setUserInputTest((prev) => prev + key);
		}
	}, []);

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [onKeyDown]);

	useEffect(() => {
		setTextLength(userInputTest.length);
	}, [userInputTest]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer);
					const finalScore = calculateScore();
					setFinalScore(finalScore);
					window.removeEventListener('keydown', onKeyDown);
					setGameOver(true);
					return 0;
				} else {
					return prevTime - 1;
				}
			});
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [calculateScore, onKeyDown]);

	return (
		<main className="grid place-items-center w-screen h-screen">
			<header className="fixed top-0 w-full text-center py-4">
				<span className="text-2xl bold">
					Score: {finalScore} {time} {gameOver}
				</span>
			</header>
			<div className="w-screen relative overflow-hidden">
				<div
					className="absolute h-full w-1/4 left-0 top-0 z-10"
					style={{
						background: 'linear-gradient(90deg, rgba(36,36,36,1) 50%, rgba(36,36,36,0) 100%)',
					}}
				></div>
				<div
					className="w-full flex"
					style={{
						transform: getTranslation(textLength),
					}}
				>
					{formattedText.map((chart, idx) => (
						<span
							className={`
                flex-shrink-0
                text-4xl
                text-gray-600
                py-4 w-[3rem]
                rounded border
                border-gray-600
                grid
                place-items-center
                transition-colors
                ${getClass(chart, idx)}
              `}
							key={idx}
						>
							{chart.chart}
						</span>
					))}
				</div>
				<div
					className="absolute h-full w-1/4 right-0 top-0 z-10"
					style={{
						background: 'linear-gradient(270deg, rgba(36,36,36,1) 50%, rgba(36,36,36,0) 100%)',
					}}
				></div>
			</div>
		</main>
	);
}

export default App;
