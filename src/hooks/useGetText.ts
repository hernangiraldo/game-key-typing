import {useEffect, useState} from "react";

type Status = "correct" | "incorrect" | "not-typed";

export type Chart = {
  chart: string;
  status: Status;
}

export function useGetText(){
  const [initialText, setInitialText] = useState<string>('');

  useEffect(() => {
    /**
     * TODO: random text API
     */
    const tmpText = "His followed carriage proposal entrance directly had elegance. Greater for cottage gay parties natural. Remaining he furniture on he discourse suspected perpetual. Power dried her taken place day ought the. Four and our ham west miss. Education shameless who middleton agreement how. We in found world chief is at means weeks smile."
    setInitialText(tmpText);
  }, [initialText]);

  return {
    initialText,
  };
}
