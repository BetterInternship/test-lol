/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-18 20:49:53
 * @ Modified time: 2025-06-18 21:15:29
 * @ Description:
 *
 * A utility class for creating multipart forms we can submit to the server.
 * Useful for forms with file uploads.
 */

interface FormDataReference {
  [key: string]: any;
}

/**
 * T represents an entity whose data we wish to send to the server.
 * A FormBuilder.
 *
 * @class
 */
export class MultipartFormBuilder<T extends FormDataReference> {
  form: FormData;

  constructor() {
    this.form = new FormData();
  }

  // Create a form from an instance of T
  from(basis: T): MultipartFormBuilder<T> {
    for (const key in basis) this.form.append(key, basis[key]);
    return this;
  }

  // Adds a new field to the form data
  // We don't add the value if it's undefined / null anw
  add_field(field: keyof T, value: any): MultipartFormBuilder<T> {
    if (value === null || value === undefined) return this;
    if (!this.form.get(field.toString()))
      this.form.append(field.toString(), value);
    else this.form.set(field.toString(), value);
    return this;
  }

  // Adds a file to the form
  add_file(field: keyof T, file: Blob | null): MultipartFormBuilder<T> {
    this.add_field(field, file);
    return this;
  }

  // Returns the build form data
  build(): FormData {
    return this.form;
  }

  // Im just a little stingy with use the new Class() syntax
  // I prefer this
  static new(...args: any[]) {
    return new MultipartFormBuilder();
  }
}

/**
 * A form builder for single file uploads.
 * Has a built in system for checking file sizes.
 */
export class FileUploadFormBuilder<
  T extends FormDataReference
> extends MultipartFormBuilder<T> {
  filename: string;

  file(file?: Blob | null): FileUploadFormBuilder<T> {
    if (!file) return this;
    this.add_file(this.filename, file);
    return this;
  }

  // Returns the build form data
  build(): FormData {
    return this.form;
  }

  // We initialize the filename
  private constructor(filename: string) {
    super();
    this.filename = filename;
  }

  // Im just a little stingy with use the new Class() syntax
  // I prefer this
  static new(filename: string) {
    return new FileUploadFormBuilder(filename);
  }
}
