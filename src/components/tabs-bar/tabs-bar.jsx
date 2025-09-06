import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropTypes from 'prop-types';


const TabsBar = ({ tabs }) => {
    const [currentTab, setCurrentTab] = useState(tabs[0]?.value);
    useEffect(() => {
        if (tabs.length > 0) {
            setCurrentTab(tabs[0].value);
        }
    }, [tabs]);

    if (!Array.isArray(tabs) || tabs.length === 0) {
        return null; // Return null if no tabs are provided
    }

    const getTabClass = (isActive) => {
        return [
            "flex items-center justify-start font-semibold  border-0 border-b-2 gap-2 p-0 m-0 text-gray-700 text-md shadow-none hover:text-gray-900 focus:outline-none focus:ring-0 rounded-none outline-none",
            "px-4 py-2 text-sm",
            isActive ? "border-blue-500 " : "border-transparent"
        ].join(" ");
    }


    return (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="bg-transparent gap-2 rounded-none border-none border-gray-200 duration-150 ">
                {tabs.map((tab) => (
                    <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={getTabClass(currentTab === tab.value)}
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}

TabsBar.prototype = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
            content: PropTypes.node.isRequired,
        })
    ).isRequired,
};

export default TabsBar;