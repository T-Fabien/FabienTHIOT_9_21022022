/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import store from "../__mocks__/store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", async () => {
    // Check if the mail icon is highlighted
    test("Then mail icon in vertical layout should be highlighted", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      //to-do write expect expression
      expect(mailIcon).toBeTruthy();
      expect(mailIcon.classList.contains("active-icon")).toBe(true);
    });
    // Check if the image is in a correct format
    describe("Then When I select an image in a correct format", () => {
      // Check if the name of the file is displayed
      test("the input file should display the file name", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        //add variable and function
        const newBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage,
        });
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
        const input = screen.getByTestId("file");
        input.addEventListener("change", handleChangeFile);
        //put a good format image (png)
        fireEvent.change(input, {
          target: {
            files: [
              new File(["image.png"], "image.png", { type: "image/png" }),
            ],
          },
        });
        //Check if the function is called and the name of the image is good
        expect(handleChangeFile).toHaveBeenCalled();
        expect(input.files[0].name).toBe("image.png");
      });
      // Check if the bill is created
      test("Then a bill is created", async () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const newBill = new NewBill({ document, onNavigate, store: null, localStorage })
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        const submit = screen.getByTestId('form-new-bill');
        submit.addEventListener('submit', handleSubmit);
        fireEvent.submit(submit)
        expect(handleSubmit).toHaveBeenCalled();
      });
      // Check if the bill is deleted if the image bad format
      test("If the image does not have a good format, Then the bill is deleted", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const newBill = new NewBill({ document, onNavigate, store: null, localStorage })
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        const input = screen.getByTestId('file');
        input.addEventListener('change', handleChangeFile);
        //put a bad format image (txt)
        fireEvent.change(input, {
            target: {files: [new File(['image.txt'], 'image.txt', {type: 'image/txt'})],
            }
        })
        expect(handleChangeFile).toHaveBeenCalled();
        expect(input.files[0].name).toBe('image.txt');
    })
    });
  });
});
