'use client'
import { useEffect, useState } from "react"

export default function Test() {
    const [obj, setObj] = useState<any[]>([])

    useEffect(() => {
        const objTest: any[] = [
            {
                key: 1,
                Images: [
                    { name: '1Test1' },
                    { name: '1Test2' },
                    { name: '1Test3' }
                ]
            },
            {
                key: 2,
                Images: [
                    { name: '2Test1' },
                    { name: '2Test2' },
                    { name: '2Test3' }
                ]
            },
            {
                key: 3,
                Images: [
                    { name: '3Test1' },
                    { name: '3Test2' },
                    { name: '3Test3' }
                ]
            }
        ]
        setObj(objTest)
    }, [])

    const handleDeleteImage = (groupIndex: number, imageIndex: number) => {
    setObj(prev => {
        if (!prev) return prev;

        console.log("🔍 ลบภาพจาก groupIndex:", groupIndex, "ตำแหน่ง imageIndex:", imageIndex);
        console.log("ก่อนลบ prev:", prev);

        const updated = [...prev];
        const images = [...updated[groupIndex].Images];

        images.splice(imageIndex, 1);

        updated[groupIndex] = {
            ...updated[groupIndex],
            Images: images,
        };

        console.log("หลังลบ updated:", updated);

        return updated;
    });
};



    return (
        <>
            {obj && obj.map((item: any, groupIdx: number) => (
                <div key={item.key} style={{ marginBottom: '1rem' }}>
                    <div><strong>Key:</strong> {item.key}</div>
                    {item.Images.map((img: any, imgIdx: number) => (
                        <div key={imgIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{img.name}</span>
                            <button
                                onClick={() => handleDeleteImage(groupIdx, imgIdx)}
                                style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '2px 6px', borderRadius: '4px' }}
                            >
                                ลบ
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}
