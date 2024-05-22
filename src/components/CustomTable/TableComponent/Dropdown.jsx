import React, { useEffect, useState, useRef } from "react";


const Dropdown = ({ children, btnHtml }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);




    return (
        <div className="dropdown" ref={ref}>
            <div className="dropdown-toggle1" onClick={() => setIsOpen(!isOpen)}>
                {btnHtml}
            </div>
            {isOpen &&
                <div className="dropdown-content">
                    {children}
                </div>
            }
        </div>
    );
};

export default Dropdown;