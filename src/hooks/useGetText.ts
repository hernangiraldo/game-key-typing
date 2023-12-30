import { useEffect, useState } from "react";

export function useGetText() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    /**
     * TODO: random text API
     */
    const text =
      "His followed carriage proposal entrance directly had elegance. Greater for cottage gay parties natural. Remaining he furniture on he discourse suspected perpetual. Power dried her taken place day ought the. Four and our ham west miss. Education shameless who middleton agreement how. We in found world chief is at means weeks smile.";
    setText(text);
  }, []);

  return {
    text,
  };
}
