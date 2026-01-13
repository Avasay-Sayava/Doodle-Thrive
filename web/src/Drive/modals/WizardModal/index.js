import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "../Modal";
import "./style.css";

const STORAGE_KEY = "tutorial-completed";

function useHighlight(selector, active) {
    useEffect(() => {
        if (!active || !selector) return;
        const el = document.querySelector(selector);
        if (!el) return;

        el.classList.add("tutorial-highlight");
        return () => {
            el.classList.remove("tutorial-highlight");
        };
    }, [selector, active]);
}

function TutorialOverlay({ active }) {
    if (!active) return null;
    return createPortal(
        <div className="tutorial-overlay" />, 
        document.body
    );
}

const Step1 = ({ onNext }) => (
    <div className="wizard-step">
        <h2>Welcome to Doodle Drive!</h2>
        <p>This is a tutorial to get you started.</p>
        <button className="wizard-button" onClick={onNext}>Next</button>
    </div>
)

const Step2 = ({ onNext, onBack }) => {
    return (
        <div className="wizard-step">
            <h2>Using the New Button</h2>
            <p>You can create folders, files, and upload content from your personal device with the new button.</p>
            <button className="wizard-button" onClick={onBack}>Back</button>
            <button className="wizard-button" onClick={onNext}>Next</button>
        </div>
    )
}

const Step3 = ({ onNext, onBack }) => (
    <div className="wizard-step">
        <h2>Accessing Settings</h2>
        <p>You can change settings and preferences in the settings menu located at the top right corner.</p>
        <button className="wizard-button" onClick={onBack}>Back</button>
        <button className="wizard-button" onClick={onNext}>Next</button>
    </div>
)

const Step4 = ({ onNext, onBack }) => (
    <div className="wizard-step">
        <h2>Right Click Options</h2>
        <p>You can also right click inside the file area to add new files or folders in the current directory.</p>
        <button className="wizard-button" onClick={onBack}>Back</button>
        <button className="wizard-button" onClick={onNext}>Next</button>
    </div>
)

const Step5 = ({ onNext, onBack }) => (
    <div className="wizard-step">
        <h2>Using the Search Bar</h2>
        <p>You can use the search bar at the top to quickly find files and folders.</p>
        <button className="wizard-button" onClick={onBack}>Back</button>
        <button className="wizard-button" onClick={onNext}>Next</button>
    </div>
)

const Step6 = ({ onFinish, onBack }) => (
    <div className="wizard-step">
        <h2>All Set!</h2>
        <p>That's it! You're ready to start using Doodle Drive. Enjoy!</p>
        <button className="wizard-button" onClick={onBack}>Back</button>
        <button className="wizard-button" onClick={onFinish}>Finish</button>
    </div>
)

function AutoOpen({ open }) {
    useEffect(() => {
        const completed = localStorage.getItem(STORAGE_KEY) === "true";
        if (!completed) {
            open();
        }
    }, [open]);

    return null;
}

function WizardModal({ onComplete }) {
    const [step, setStep] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const STEP_TARGETS = {
        2: '.new-button',
        3: '[data-tutorial="settings-button"] svg',
        4: '.file-view-table-wrapper',
        5: '.search-bar',
    };

    const currentSelector = STEP_TARGETS[step] || null;
    useHighlight(currentSelector, isDialogOpen);

    const handleFinish = (close) => {
        localStorage.setItem(STORAGE_KEY, "true");
        if (typeof onComplete === "function") {
            onComplete();
        }
        close();
    };

    const renderStep = (close) => {
        switch (step) {
            case 1:
                return <Step1 onNext={() => setStep(2)} />;
            case 2:
                return <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />;
            case 3:
                return <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} />;
            case 4:
                return <Step4 onNext={() => setStep(5)} onBack={() => setStep(3)} />;
            case 5:
                return <Step5 onNext={() => setStep(6)} onBack={() => setStep(4)} />;
            case 6:
                return <Step6 onFinish={() => handleFinish(close)} onBack={() => setStep(5)} />;
            default:
                return null;
        }
    };

    const renderBody = (isOpen, shouldRender, close) => {
        if (!shouldRender) return null;
        return (
            <div className="wizard-modal">
                {renderStep(close)}
            </div>
        );
    };

    const onClose = () => {
        setIsDialogOpen(false);
        localStorage.setItem(STORAGE_KEY, "true");
        if (typeof onComplete === "function") onComplete();
    }

    return (
        <>
            <TutorialOverlay active={isDialogOpen} />
            <Modal
            onOpen={() => setIsDialogOpen(true)}
            onClose={onClose}
            title="Tutorial"
            renderBody={renderBody}
        >
            {(open) => <AutoOpen open={open} />}
        </Modal>
    </>
    );
}

export default WizardModal;
