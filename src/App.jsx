import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  //  State management
  const [length, setLength] = useState(10);
  const [isNumberAllowed, setIsNumberAllowed] = useState(false);
  const [isCharAllowed, setIsCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("Weak");

  //  Reference for copying password
  const passwordRef = useRef(null);

  //  Password Generator Function
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (isNumberAllowed) str += "0123456789";
    if (isCharAllowed) str += "~!@#$%^&*()_+";

    for (let i = 0; i < length; i++) {
      let charIndex = Math.floor(Math.random() * str.length);
      pass += str.charAt(charIndex);
    }

    setPassword(pass);
  }, [length, isNumberAllowed, isCharAllowed]);

  //  Password Strength Checker
  const checkStrength = useCallback(() => {
    let score = 0;

    if (length >= 12) score++;
    if (isNumberAllowed) score++;
    if (isCharAllowed) score++;
    if (password.length > 15) score++;

    if (score <= 1) setStrength("Weak");
    else if (score === 2) setStrength("Medium");
    else setStrength("Strong");
  }, [length, isNumberAllowed, isCharAllowed, password]);

  //  Auto-generate password when settings change
  useEffect(() => {
    passwordGenerator();
  }, [passwordGenerator]);

  //  Update strength when password changes
  useEffect(() => {
    checkStrength();
  }, [password, checkStrength]);

  //  Copy password to clipboard
  const copyPassword = () => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  };

  return (
    <div className="w-full max-w-md mx-auto shadow-lg rounded-xl my-8 bg-gray-900 px-6 py-4 text-white">
      
      {/*  Title */}
      <h1 className="text-2xl text-center font-bold mb-4">
        🔐 Password Generator
      </h1>

      {/*  Input + Copy */}
      <div className="flex rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={password}
          ref={passwordRef}
          readOnly
          className="w-full px-3 py-2 text-white"
        />
        <button
          onClick={copyPassword}
          className="bg-blue-600 px-3 text-white"
        >
          Copy
        </button>
      </div>

      {/*  Strength Meter */}
      <div className="mb-4">
        <p>
          Strength:{" "}
          <span
            className={
              strength === "Weak"
                ? "text-red-400"
                : strength === "Medium"
                ? "text-yellow-400"
                : "text-green-400"
            }
          >
            {strength}
          </span>
        </p>
      </div>

      {/*  Controls */}
      <div className="flex flex-col gap-3">

        {/*Length Slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={6}
            max={50}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="cursor-pointer"
          />
          <label>Length: {length}</label>
        </div>

        {/* Include Numbers */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isNumberAllowed}
            onChange={() => setIsNumberAllowed((prev) => !prev)}
          />
          <label>Include Numbers</label>
        </div>

        {/* Include Symbols */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCharAllowed}
            onChange={() => setIsCharAllowed((prev) => !prev)}
          />
          <label>Include Symbols</label>
        </div>

      </div>
    </div>
  );
}

export default App;