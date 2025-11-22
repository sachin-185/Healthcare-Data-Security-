import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("dark");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicalRecord, setMedicalRecord] = useState("");
  const [mode, setMode] = useState("CBC");
  const [keySize, setKeySize] = useState(128);
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [outputFormat, setOutputFormat] = useState("Base64");
  const [ciphertext, setCiphertext] = useState("");
  const [decryptedtext, setDecryptedtext] = useState("");

  useEffect(() => {
    // Hide IV input if mode is ECB
    if (mode === "ECB") setIv("");
  }, [mode]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const encrypt = () => {
    const plaintext = `Patient Name: ${patientName}, Diagnosis: ${diagnosis}, Medical Record: ${medicalRecord}`;
    let encrypted;
    if (mode === "CBC") {
      const cipher = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      encrypted = cipher.ciphertext;
    } else {
      const cipher = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      encrypted = cipher.ciphertext;
    }

    if (outputFormat === "Hex") {
      encrypted = encrypted.toString(CryptoJS.enc.Hex);
    } else {
      encrypted = CryptoJS.enc.Base64.stringify(encrypted);
    }

    setCiphertext(encrypted);
  };

  const decrypt = () => {
    let encryptedText = ciphertext;
    let decrypted;
    if (mode === "CBC") {
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: outputFormat === "Hex" ? CryptoJS.enc.Hex.parse(encryptedText) : CryptoJS.enc.Base64.parse(encryptedText),
      });
      decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    } else {
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: outputFormat === "Hex" ? CryptoJS.enc.Hex.parse(encryptedText) : CryptoJS.enc.Base64.parse(encryptedText),
      });
      decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
    }
    setDecryptedtext(decrypted.toString(CryptoJS.enc.Utf8));
  };

  return (
    <div className={`container ${theme}`}>
      <h1>Healthcare Data Security</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <div className="form-container">
        <div className="column">
          <label>Patient Name:</label>
          <input value={patientName} onChange={e => setPatientName(e.target.value)} />
          <label>Diagnosis:</label>
          <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
          <label>Medical Record:</label>
          <textarea value={medicalRecord} onChange={e => setMedicalRecord(e.target.value)} />
          <label>Select AES Mode:</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="CBC">CBC</option>
            <option value="ECB">ECB</option>
          </select>
          {mode === "CBC" && (
            <>
              <label>Enter IV:</label>
              <input value={iv} onChange={e => setIv(e.target.value)} />
            </>
          )}
          <label>Key Size:</label>
          <select value={keySize} onChange={e => setKeySize(parseInt(e.target.value))}>
            <option value={128}>128</option>
            <option value={192}>192</option>
            <option value={256}>256</option>
          </select>
        </div>
        <div className="column">
          <label>Secret Key:</label>
          <input value={key} onChange={e => setKey(e.target.value)} />
          <label>Output Format:</label>
          <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
            <option value="Base64">Base64</option>
            <option value="Hex">Hex</option>
          </select>
          <button onClick={encrypt}>Encrypt</button>
          <label>Encrypted Data:</label>
          <textarea value={ciphertext} readOnly />
          <button onClick={decrypt}>Decrypt</button>
          <label>Decrypted Data:</label>
          <textarea value={decryptedtext} readOnly />
        </div>
      </div>
    </div>
  );
}

export default App;
