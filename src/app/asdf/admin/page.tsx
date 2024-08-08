'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter, Table } from '@/components/ui/table';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Admin = () => {
    const [data, setData] = useState<any[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [details, setDetails] = useState<any>();
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.id]: e.target.value })
    }

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/get-all-subscribers");
            setData(data.subscribers);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const deleteSubscriber = async (id: string) => {
        try {
            const { data } = await axios.delete("/api/subscriber", { data: { id } });
            if (data.hasOwnProperty("success")) {
                if (data.success) {
                    toast.success("Subscriber deleted successfully");
                    fetchSubscribers();
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const updateSubscriber = async () => {
        try {
            setLoading(true);
            const { data } = await axios.put("/api/subscriber", details);
            if (data.hasOwnProperty("success")) {
                if (data.success) {
                    toast.success("Subscriber updated successfully");
                    fetchSubscribers();
                    setIsEdit(false);
                    setDetails({});
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const addToList = async () => {
        try {
            setLoading(true);
            if (details.name === "" || details.email === "" || details.contact === "") {
                return toast.error("Please fill all the fields");
            }
            const { data } = await axios.post("/api/add-mail-list", details);
            if (data.hasOwnProperty("success")) {
                if (data.success) {
                    toast.success("Added to list successfully");
                    setIsEdit(false);
                    fetchSubscribers();
                    setDetails({
                        name: "",
                        email: "",
                        contact: "",
                    })
                } else {
                    if (data.hasOwnProperty("message")) {
                        return toast.error(data.message);
                    }
                    toast.error("Failed to add to list");
                }
            }
            console.log(data)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSubscribers();
    }, []);
    return (
        <div className='flex flex-col items-center m-10 gap-5'>
            <p>This is admin dashboard</p>
            {loading ? <p>Loading</p> : <Table className='w-[90%]'>
                <TableCaption>A list of all subscribers.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr. no</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((subscriber, index) => (
                        <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">{subscriber.name}</TableCell>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{subscriber.contact}</TableCell>
                            <TableCell className='flex gap-2 items-center'>
                                <Button onClick={() => {
                                    setIsEdit(true);
                                    setDetails(subscriber);
                                }} size={"sm"} variant={'outline'}>
                                    Edit
                                </Button>
                                <Button onClick={() => deleteSubscriber(subscriber.id)} size={"sm"} variant={"destructive"}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{data.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>}
            <Button variant={'default'} onClick={() => {
                setIsEdit(true);
                setDetails({ email: '', name: '', contact: '' });
            }}>Add new subscriber</Button>
            <Dialog open={isEdit} onOpenChange={() => setIsEdit(!isEdit)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{details?.id ? 'Edit' : 'Add'} Subscriber</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input value={details?.name} onChange={(e) => handleChange(e)} id="name" placeholder="Your Name" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input value={details?.email} onChange={(e) => handleChange(e)} id="email" placeholder="Your Email" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="contact">Contact</Label>
                            <Input value={details?.contact} onChange={(e) => handleChange(e)} id="contact" placeholder="Your Contact Number" />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        {details?.id ? <Button onClick={updateSubscriber} >
                            {loading ? "Updating..." : "Update"}
                        </Button> :
                            <Button onClick={addToList} >
                                {loading ? "Adding..." : "Add to List"}
                            </Button>
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Admin
