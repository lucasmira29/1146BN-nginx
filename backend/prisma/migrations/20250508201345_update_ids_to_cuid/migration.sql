/*
  Warnings:

  - The primary key for the `historicos_consultas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `registros_medicos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `historicos_consultas` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `registros_medicos` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
