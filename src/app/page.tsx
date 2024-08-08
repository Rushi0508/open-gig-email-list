'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    contact: "",
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.id]: e.target.value })
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

  return (
    <div className="flex flex-col items-center m-10 gap-5 w-full">
      <p className="text-center text-4xl font-semibold">Join the mailing list! Now</p>
      <div className="w-full flex justify-center">
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle>Enter your details</CardTitle>
            <CardDescription>Add details to get email daily</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input value={details.name} onChange={(e) => handleChange(e)} id="name" placeholder="Your Name" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input value={details.email} onChange={(e) => handleChange(e)} id="email" placeholder="Your Email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="contact">Contact</Label>
                  <Input value={details.contact} onChange={(e) => handleChange(e)} id="contact" placeholder="Your Contact Number" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={addToList} >
              {loading ? "Adding..." : "Add to list"}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
