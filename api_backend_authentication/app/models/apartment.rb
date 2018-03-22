class Apartment < ApplicationRecord
  belongs_to :user
  validates :user, presence: true
  resourcify
  has_attached_file :avatar, styles: { small: "64x64", med: "100x100", large: "200x200" }
  validates_attachment :avatar, presence: true,
    content_type: {content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"]},
    size: { in: 0..10.megabytes }

  attr_accessor :avatar_base
  before_validation :parse_avatar_base

  private
  def parse_avatar_base
    if avatar_base
      image = Paperclip.io_adapters.for(avatar_base)
      image.original_filename = "file.#{image.content_type.split("/")[1]}"
      self.avatar = image
    end
  end 
end
