import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiX } from "react-icons/fi";

// Yup Schema
const schema = yup.object({
	nama: yup.string().trim().min(3, "Nama produk minimal 3 karakter").max(100, "Nama produk maksimal 100 karakter").required("Nama produk wajib diisi"),

	merek: yup.string().trim().min(2, "Merek minimal 2 karakter").max(50, "Merek maksimal 50 karakter").required("Merek wajib diisi"),

	harga: yup.number().typeError("Harga harus berupa angka").positive("Harga harus lebih dari 0").integer("Harga tidak boleh desimal").required("Harga wajib diisi"),

	hargaAsli: yup
		.number()
		.typeError("Harga asli harus berupa angka")
		.positive("Harga asli harus lebih dari 0")
		.integer("Harga asli tidak boleh desimal")
		.min(yup.ref("harga"), "Harga asli tidak boleh lebih kecil dari harga jual")
		.nullable()
		.transform((val, orig) => (orig === "" ? null : val)),

	stok: yup.number().typeError("Stok harus berupa angka").min(0, "Stok tidak boleh negatif").integer("Stok harus bilangan bulat").required("Stok wajib diisi"),

	kategori: yup.string().oneOf(["Elektronik", "Fashion", "Rumah & Dapur", "Kecantikan", "Olahraga"], "Pilih kategori yang valid").required("Kategori wajib dipilih"),

	gambar: yup
		.mixed()
		.test("required", "Gambar produk wajib diunggah", (val) => val && val.length > 0)
		.test("fileSize", "Ukuran gambar maksimal 2MB", (val) => {
			if (!val || !val[0]) return true;
			return val[0].size <= 2 * 1024 * 1024;
		})
		.test("fileType", "Format gambar harus JPG, PNG, atau WebP", (val) => {
			if (!val || !val[0]) return true;
			return ["image/jpeg", "image/png", "image/webp"].includes(val[0].type);
		}),

	deskripsi: yup.string().trim().min(10, "Deskripsi minimal 10 karakter").max(1000, "Deskripsi maksimal 1000 karakter").required("Deskripsi wajib diisi"),

	unggulan: yup.boolean(),
	baru: yup.boolean(),
});

// Field helpers
const inputClass = (err) => `w-full h-11 rounded-xl border px-3 text-sm text-text-primary bg-surface outline-none transition-colors ${err ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`;

function FieldError({ msg }) {
	if (!msg) return null;
	return <p className='text-xs text-red-500 mt-1'>{msg}</p>;
}

function Label({ children, required }) {
	return (
		<label className='block text-sm font-medium text-text-primary mb-1.5'>
			{children}
			{required && <span className='text-red-500 ml-0.5'>*</span>}
		</label>
	);
}

// Modal
export default function AddProductModal({ onClose, onSubmit: onSubmitProp }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			nama: "",
			merek: "",
			harga: "",
			hargaAsli: "",
			stok: "",
			kategori: "Elektronik",
			deskripsi: "",
			unggulan: false,
			baru: false,
		},
	});

	const onSubmit = (data) => {
		onSubmitProp?.(data);
		reset();
		onClose();
	};

	return (
		// Overlay
		<div
			className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<section className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl'>
				{/* Modal Header */}
				<header className='flex items-center justify-between px-6 py-5 border-b border-border shrink-0'>
					<h2 className='text-lg font-semibold text-text-primary'>Tambah Produk Baru</h2>
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors cursor-pointer'>
						<FiX className='text-[18px] text-text-secondary' />
					</button>
				</header>

				{/* Form — scrollable */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-4 px-6 py-5 overflow-y-auto'>
					{/* Row: Nama + Merek */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label required>Nama Produk</Label>
							<input
								{...register("nama")}
								type='text'
								placeholder='Masukkan nama produk'
								className={inputClass(errors.nama)}
							/>
							<FieldError msg={errors.nama?.message} />
						</div>
						<div>
							<Label required>Merek</Label>
							<input
								{...register("merek")}
								type='text'
								placeholder='Masukkan merek'
								className={inputClass(errors.merek)}
							/>
							<FieldError msg={errors.merek?.message} />
						</div>
					</div>

					{/* Row: Harga + Harga Asli */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label required>Harga Jual (IDR)</Label>
							<input
								{...register("harga")}
								type='number'
								placeholder='0'
								min={0}
								className={inputClass(errors.harga)}
							/>
							<FieldError msg={errors.harga?.message} />
						</div>

						<div>
							<Label>Harga Asli / Coret (IDR)</Label>
							<input
								{...register("hargaAsli")}
								type='number'
								placeholder='0'
								min={0}
								className={inputClass(errors.hargaAsli)}
							/>
							<FieldError msg={errors.hargaAsli?.message} />
						</div>
					</div>

					{/* Row: Stok + Kategori */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label required>Stok</Label>
							<input
								{...register("stok")}
								type='number'
								placeholder='0'
								min={0}
								className={inputClass(errors.stok)}
							/>
							<FieldError msg={errors.stok?.message} />
						</div>
						<div>
							<Label required>Kategori</Label>
							<select
								{...register("kategori")}
								className={`${inputClass(errors.kategori)} cursor-pointer`}>
								{["Elektronik", "Fashion", "Rumah & Dapur", "Kecantikan", "Olahraga"].map((k) => (
									<option key={k}>{k}</option>
								))}
							</select>
							<FieldError msg={errors.kategori?.message} />
						</div>
					</div>

					{/* Gambar */}
					<div>
						<Label required>Gambar Produk</Label>
						<input
							{...register("gambar")}
							type='file'
							accept='image/jpeg,image/png,image/webp'
							className={`w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary-light border rounded-xl px-3 py-2 transition-colors ${
								errors.gambar ? "border-red-400" : "border-border"
							}`}
						/>
						<p className='text-xs text-text-secondary mt-1'>Format: JPG, PNG, WebP. Maks 2MB.</p>
						<FieldError msg={errors.gambar?.message} />
					</div>

					{/* Deskripsi */}
					<div>
						<Label required>Deskripsi</Label>
						<textarea
							{...register("deskripsi")}
							rows={4}
							placeholder='Masukkan deskripsi produk'
							className={`w-full rounded-xl border px-3 py-2.5 text-sm text-text-primary bg-surface outline-none resize-none transition-colors ${
								errors.deskripsi ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
							}`}
						/>
						<FieldError msg={errors.deskripsi?.message} />
					</div>

					{/* Checkbox */}
					<div className='flex items-center gap-6'>
						<label className='flex items-center gap-2 cursor-pointer select-none'>
							<input
								{...register("unggulan")}
								type='checkbox'
								className='w-4 h-4 accent-primary cursor-pointer'
							/>
							<span className='text-sm text-text-primary'>Produk Unggulan</span>
						</label>
						<label className='flex items-center gap-2 cursor-pointer select-none'>
							<input
								{...register("baru")}
								type='checkbox'
								className='w-4 h-4 accent-primary cursor-pointer'
							/>
							<span className='text-sm text-text-primary'>Produk Baru</span>
						</label>
					</div>

					{/* Footer Buttons */}
					<footer className='flex items-center justify-end gap-3 pt-2 border-t border-border mt-2'>
						<button
							type='button'
							onClick={onClose}
							className='px-5 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-xl hover:bg-surface transition-colors cursor-pointer'>
							Batal
						</button>
						<button
							type='submit'
							disabled={isSubmitting}
							className='px-5 py-2.5 text-sm font-medium text-white btn-accent rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
							{isSubmitting ? "Menyimpan..." : "Tambah Produk"}
						</button>
					</footer>
				</form>
			</section>
		</div>
	);
}
