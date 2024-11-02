
import React, { useState } from 'react';
import axios from 'axios';

function Page() {
    const [image, setImage] = useState(null);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [response, setResponse] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const uploadImage = async () => {
        if (!file) {
            window.alert("Please select a file");
            return; 
        }

        setResponse(false); 

        const data = new FormData();
        data.append('file', file);
        data.append('width', width);
        data.append('height', height);

        try {
            const res = await axios.post('https://image-resizer-task-server.onrender.com/upload', data);
            console.log(res);
            if (res.status === 200) {
                setResponse(true);
                setImage(res.data.imageUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    const downloadImage = async () => {
        try {
            console.log(image);
            const res = await axios.get(`https://image-resizer-task-server.onrender.com/download/${image}`, {
                responseType: "blob",
            });

            const imgUrl = window.URL.createObjectURL(new Blob([res.data]));
            setPreviewUrl(imgUrl);
        } catch (error) {
            console.error("Error downloading the image:", error);
        }
    };

    return (
        <div className="flex flex-col items-center m-10">
            <p className='text-blue-500 font-bold text-3xl'>Image Resizer</p>
            <div className='flex flex-col'>
                <div className='mx-20 my-4'>
                <input 
                className=' w-fit bg-blue-400 p-2 rounded-lg '
                 type="file" onChange={handleImageUpload} />
                </div>
              
                <div className='m-4 p-2 flex gap-3'>
                <input
                className='border-2 border-blue-600 p-2 rounded-lg text-center'
                    type="number"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                />
                <input
                className='border-2 border-blue-600 p-2 rounded-lg text-center'
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                />

                </div>
           
                {response && (
                    <p>
                        Ready to Download
                    </p>
                )}
            </div>

            {(width !== "" || height !== "") && !response && (
                <button
                    onClick={uploadImage}
                    className="mt-4 bg-blue-500 text-white p-2 rounded">
                    Upload
                </button>
            )}

            {image && (
                <button
                    onClick={downloadImage}
                    className="mt-4 bg-green-500 text-white p-2 rounded">
                    Download Image
                </button>
            )}

            {previewUrl && (
                <div>
                    <h2>Image Preview:</h2>
                    <img src={previewUrl} alt="Preview" className='w-60 h-auto' />
                </div>
            )}
        </div>
    );
}

export default Page;
